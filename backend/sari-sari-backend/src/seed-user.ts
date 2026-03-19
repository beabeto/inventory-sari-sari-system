import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const username = 'admin';
  const password = 'admin123';

  const existing = await usersService.findOne(username);
  if (!existing) {
    const user = await usersService.create(username, password);
    console.log('Seed user created:', user);
  } else {
    console.log('User already exists:', existing);
  }

  await app.close();
}

bootstrap();