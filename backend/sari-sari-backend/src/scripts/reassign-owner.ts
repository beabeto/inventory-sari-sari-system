import "reflect-metadata";
import { DataSource } from "typeorm";

async function main() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'beto',
    password: 'beto2004',
    database: 'sari_sari_db',
  });

  await dataSource.initialize();
  console.log('Connected to DB');

  const fromUserId = 2; // current owner
  const toUserId = 1;   // new owner (userone)

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log(`Updating categories user_id ${fromUserId} -> ${toUserId}`);
    await queryRunner.manager.query(
      `UPDATE categories SET user_id = ? WHERE user_id = ?`,
      [toUserId, fromUserId]
    );

    console.log(`Updating products user_id ${fromUserId} -> ${toUserId}`);
    await queryRunner.manager.query(
      `UPDATE products SET user_id = ? WHERE user_id = ?`,
      [toUserId, fromUserId]
    );

    await queryRunner.commitTransaction();
    console.log('Done, transaction committed');
  } catch (err) {
    console.error('Error during reassign, rolling back', err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
