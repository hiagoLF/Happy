import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'
import Orphanage from './orphanages'

//Entity é uma decorator para dizer ao TypeScipt que essa classe corresponde a coluna
@Entity('image')
export default class Image {
    //Decorator para dizer que essa é a coluna primária
    @PrimaryGeneratedColumn('increment')
    id: number;

    //Decorator para dizer que isso é uma coluna
    @Column()
    path: string;

    //Essa Imagem(e outras também), serão enviadas para um orfanato
    //Lá em orfanato elas serão armazenadas na JoinColumn images
    @ManyToOne(() => Orphanage, orphanage => orphanage.images)
    
    //Agora sim, a JoinColum orphanage irá receber um orfanato
    //Orphanage aqui não vai ser um array porque é um orfanato para cada foto.
    @JoinColumn({name: 'orphanage_id'})
    orphanage: Orphanage;
}
//Pra tirar o erro daqui eu coloquei "strictPropertyInitialization": false nas tsconfig
//Assim, não precisa colocar template antes de sair colocando dado.
//E habilitei alguns decorators lá também.