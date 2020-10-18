import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class users1602983373633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            //Nome da tabela
            name: 'users',
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
                    name: 'name',
                    //varchar --> string curta
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar'
                },
                {
                    name: 'user_type',
                    type: 'integer',
                    default: 0,
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
