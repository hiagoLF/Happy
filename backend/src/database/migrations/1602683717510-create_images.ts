import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createImages1602683717510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'image',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'path',
                    type: 'varchar'
                },
                {
                    name: 'orphanage_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'ImageOrphanage',
                    //Em qual coluna desta tabela, ela se referencia
                    columnNames: ['orphanage_id'],
                    //Em qual tabela, ela se referencia
                    referencedTableName: 'orphanages',
                    //Em quala coluna dessa tabela que ela se relaciona 
                    referencedColumnNames: ['id'],
                    //Se o essa coluna do orfanato mudar, a coluna do orfanato na tabela de imagens também muda
                    onUpdate: 'CASCADE',
                    //Se o orfanato for deletado, as suas imagnes também serão
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('image')
    }

}
