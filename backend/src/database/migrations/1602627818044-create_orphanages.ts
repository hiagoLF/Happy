import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createOrphanages1602627818044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //Criar tabela ou add valores
        await queryRunner.createTable(new Table({
            //Nome da Tabela
            name: 'orphanages',
            //Colunas da tabela
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    //unsigned --> O número nunca pode ser negativo
                    unsigned: true,
                    //isPrimary --> Será a chave indentificadora de cada dado
                    isPrimary: true,
                    //isGenerated --> Coluna ser gerada automaticamente
                    isGenerated: true,
                    //generationStrategy: increment --> O dado será gerado utilizando uma lógica incremental --> 1, 2, 3, 4...
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    //varchar --> String curta --> Até 200 caracteres
                    type: 'varchar'
                },
                {
                    name: 'opening_hours',
                    //varchar --> String curta --> Até 200 caracteres
                    type: 'varchar'
                },
                {
                    name: 'latitude',
                    type: 'decimal',
                    scale: 10,
                    precision: 2
                },
                {
                    name: 'longitude',
                    type: 'decimal',
                    scale: 10,
                    precision: 2
                },
                {
                    name: 'about',
                    type: 'text'
                },
                {
                    name: 'instructions',
                    type: 'text'
                },
                {
                    name: 'open_on_weekend',
                    type: 'boolean',
                    default: false,
                },
                //Criei authorizes para saber se o orfanato esta autorizado ou não
                {
                    name: 'authorized',
                    type: 'boolean',
                    default: false
                },
                //Criei user_id para receber id de usuários de outra tabela
                //Como essa coluna se relaciona, eu tenho que configurar suas foreignKeys
                {
                    name: 'user_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'UserOrphanage',
                    //Em qual coluna dessa tabela, ela se referencia
                    columnNames: ['user_id'],
                    //Nome da outra tabela
                    referencedTableName: 'users',
                    //Coluna na outra tabela
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //Desfazer algo
        await queryRunner.dropTable('orphanages')
    }

}
