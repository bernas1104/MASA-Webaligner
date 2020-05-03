import { MigrationInterface, QueryRunner, Table } from 'typeorm';
// import { v4 } from 'uuid';

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
            name: 'blockPruning',
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
            name: 'fullName',
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
