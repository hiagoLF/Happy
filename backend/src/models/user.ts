import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from 'typeorm'

//Importar o model Orphanage
import Orphanage from './orphanages'

//Sinaliza qual o nome dessa tabela
@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: number;

    @Column()
    user_type: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Orphanage, orphanage => orphanage.user, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({name: 'user_id'})
    orphanages: Orphanage[]
}