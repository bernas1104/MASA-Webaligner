import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAlignment1588260754710
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alignments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'extension',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'clearn',
            type: 'boolean',
            default: false,
          },
          {
            name: 'only1',
            type: 'boolean',
            default: false,
          },
          {
            name: 'block_pruning',
            type: 'boolean',
            default: true,
          },
          {
            name: 'complement',
            type: 'integer',
            default: 0,
          },
          {
            name: 'reverse',
            type: 'integer',
            default: 0,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alignments');
  }
}
