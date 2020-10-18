import {Request, Response} from 'express'

import {getRepository} from 'typeorm'

import orphanageView from '../views/orphanages_view'

import Orphanage from '../models/orphanages'

import * as Yup from 'yup'

export default {

    async show(req: Request, res: Response){

        const { id } = req.params

        const orphanagesRepostory = getRepository(Orphanage)

        const orphanage = await orphanagesRepostory.findOneOrFail(id, {
            relations: ['images']
        })

        res.json(orphanageView.render(orphanage))
    },

    async index(req: Request, res: Response){
        const orphanagesRepostory = getRepository(Orphanage)

        const orphanage = await orphanagesRepostory.find({
            where: {authorized:true},
            relations: ['images']
            //Trazer as imagens também
        })



        res.json(orphanageView.renderMany(orphanage))
    },

    async create(req: Request, res: Response) {
        //@ts-ignore
        const userID = req.userId

        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekend,
        } = req.body
    
        const orphanagesRepostory = getRepository(Orphanage)
        
        //Aqui estou instruindo para o meu código que isso aqui é uma array de arquivos.
        const requestImages = req.files as Express.Multer.File[]
        const images = requestImages.map(image => {
            return {path: image.filename}
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekend: open_on_weekend == 'true',
            images,
            user: userID,
            authorized: false
        }

        //Validação de dados com Yup
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            open_on_weekend: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        })

        //Se os dados não tiverem de acordo, deve dar um erro.
        await schema.validate(data, {
            //Com isso o erro será retornado para todos os campos errados e não somente o primeiro que ele encontrar
            abortEarly: false
        })

        const orphanage = orphanagesRepostory.create(data)
    
        await orphanagesRepostory.save(orphanage)
        
        //Significados semânticos dos status
        //Status 201 --> Algo foi criado.
        return res.status(201).json({data: orphanage})
    },

    async delete(req: Request, res: Response){
        //@ts-ignore
        const userOfRequest = req.userId
        const orphanageOfDeletion = req.body.id

        const orphanages = getRepository(Orphanage)
        const orphanage = await orphanages.findOneOrFail(orphanageOfDeletion, {
            relations: ['user']
        })

        if(userOfRequest !== orphanage.user.id){
            return res.status(401).json({error: 'You are not this orphanage creator'})
        }

        const response = await orphanages.delete(orphanage)

        res.json({message: 'The orphanage was deleted'})
    }
}