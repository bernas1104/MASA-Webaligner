import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlignmentReadyFlag1590505149514
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'alignments',
      new TableColumn({
        name: 'ready',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('alignments', 'ready');
  }
}
