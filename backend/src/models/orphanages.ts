import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm'

//Importaremos aqui o Image para fazermos a relação de orfanatos com imagens
import Image from './Image'
import User from './user'


//Entity é uma decorator para dizer ao TypeScipt que essa classe corresponde a coluna
@Entity('orphanages')
export default class Orphanage {
    //Decorator para dizer que essa é a coluna primária
    @PrimaryGeneratedColumn('increment')
    id: number;

    //Decorator para dizer que isso é uma coluna
    @Column()
    name: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    about: string;

    @Column()
    instructions:string;

    @Column()
    opening_hours: string;

    @Column()
    open_on_weekend:boolean;

    @Column()
    authorized: boolean;

    //Não coloco Column aqui porque essa não é uma coluna do banco de dados
    //Aqui vai ser apenas para sinalizar o Elo...
    //Um orfanato recebe várias imagens -> A JoinColumn de cada image receberá um orphanage
    @OneToMany(() => Image, image => image.orphanage, {
        //Quando o orfanato for alterado ou cadastrado. As imagens tambem serão
        cascade: ['insert', 'update']
    })
    //Essa JoinColumn, por fim, vai receber várias imagens
    //Aqui vai ser uma array de Imagens --> Por isso o colchetes
    //orphanage_id é a coluna da tabela imagens em que essa tabela se relaciona
    @JoinColumn({name: 'orphanage_id'})
    images: Image[];


    @ManyToOne(() => User, user => user.orphanages,)
    @JoinColumn({name: 'user_id'})
    user: User
}
//Pra tirar o erro daqui eu coloquei "strictPropertyInitialization": false nas tsconfig
//Assim, não precisa colocar template antes de sair colocando dado.
//E habilitei alguns decorators lá também.