import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSequence1588272700977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sequences',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'file',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'size',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'origin',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'edge',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'alignment_id',
            type: 'uuid',
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'sequences',
      new TableForeignKey({
        name: 'AlignmentAttached',
        columnNames: ['alignment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'alignments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sequences', 'AlignmentAttached');

    await queryRunner.dropTable('sequences');
  }
}
