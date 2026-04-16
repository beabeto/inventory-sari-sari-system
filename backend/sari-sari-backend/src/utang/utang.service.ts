import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Utang } from './utang.entity';
import { UtangItem } from './utang-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class UtangService {
  constructor(
    @InjectRepository(Utang)
    private utangRepo: Repository<Utang>,

    @InjectRepository(UtangItem)
    private itemRepo: Repository<UtangItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.utangRepo.find({ relations: ['items'] });
  }

  async create(data: { name: string; items: any[] }) {
    const items: UtangItem[] = [];

    for (const item of data.items) {
      const product = await this.productRepo.findOne({
        where: { product_id: item.product_id },
      });

      if (!product) throw new NotFoundException(`Product ID ${item.product_id} not found`);

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      // Deduct stock
      product.stock -= item.quantity;
      await this.productRepo.save(product);

      const subtotal = Number(product.price) * item.quantity;

      items.push(
        this.itemRepo.create({
          product_id: product.product_id,
          product_name: product.name,
          quantity: item.quantity,
          price: Number(product.price),
          subtotal,
        }),
      );
    }

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    const utang = this.utangRepo.create({
      name: data.name,
      total_debt: total,
      is_paid: false,
      items,
    });

    return this.utangRepo.save(utang);
  }

  async update(id: number, data: { name: string; items: any[] }) {
    const existing = await this.utangRepo.findOne({
      where: { utang_id: id },
      relations: ['items'],
    });

    if (!existing) throw new NotFoundException('Utang record not found');

    // 1. RESTORE STOCK FIRST
    for (const oldItem of existing.items) {
      const product = await this.productRepo.findOne({
        where: { product_id: oldItem.product_id },
      });
      if (product) {
        product.stock += oldItem.quantity;
        await this.productRepo.save(product);
      }
    }

    // 2. DELETE OLD ITEMS
    await this.itemRepo.delete({ utang: { utang_id: id } });

    // 3. RE-CALCULATE NEW ITEMS (Logic similar to create, but manually handling the entity)
    const newItems: UtangItem[] = [];
    for (const item of data.items) {
      const product = await this.productRepo.findOne({ where: { product_id: item.product_id } });
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`Stock error for product ${item.product_id}`);
      }

      product.stock -= item.quantity;
      await this.productRepo.save(product);

      newItems.push(
        this.itemRepo.create({
          product_id: product.product_id,
          product_name: product.name,
          quantity: item.quantity,
          price: Number(product.price),
          subtotal: Number(product.price) * item.quantity,
        }),
      );
    }

    // 4. UPDATE EXISTING RECORD INSTEAD OF CREATING NEW
    existing.name = data.name;
    existing.items = newItems;
    existing.total_debt = newItems.reduce((sum, i) => sum + i.subtotal, 0);

    return this.utangRepo.save(existing);
  }

  async togglePaid(id: number) {
    const utang = await this.utangRepo.findOneBy({ utang_id: id });
    if (!utang) throw new NotFoundException('Utang not found');

    utang.is_paid = !utang.is_paid;
    return this.utangRepo.save(utang);
  }

  async remove(id: number) {
    const utang = await this.utangRepo.findOne({
      where: { utang_id: id },
      relations: ['items'],
    });

    if (!utang) throw new NotFoundException('Utang not found');

    // Restore stock
    for (const item of utang.items) {
      const product = await this.productRepo.findOne({ where: { product_id: item.product_id } });
      if (product) {
        product.stock += item.quantity;
        await this.productRepo.save(product);
      }
    }

    await this.utangRepo.remove(utang);
  }
}