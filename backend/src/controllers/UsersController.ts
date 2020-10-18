import {Request, Response} from 'express'

import {getRepository} from 'typeorm'

import User from '../models/user'

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
const authConfig = require('../config/authConfig.json')

export default {
    async create(req: Request, res: Response){

        const {name, email, password} = req.body

        const usersRepository = getRepository(User)
        
        const hash = await bcrypt.hash(password, 10)

        const orphanage = usersRepository.create({
            name,
            email,
            password: hash,
            user_type: 0,
        })

        //Depois a gent ajeita a validação com YUO
        try{
            usersRepository.save(orphanage)
            res.status(200).json({message: 'Success on register'})
        }catch(err){
            res.status(400).json({error: 'Failed on register'})
        }
    },

    async login(req: Request, res: Response){
        const {email, password} = req.body

        //Procurando o usuário no banco de dados
        const users = getRepository(User)
        const user = await users.findOneOrFail({where: {email}})

        //Verificando a senha
        if(!await bcrypt.compare(password, user.password)){
            res.status(401).json({error: 'Wrong password'})
        }

        const token = jwt.sign({id: user.id}, authConfig.JWTSecret, {expiresIn: 3600})
        const {id, password:string , ...rest} = user

        res.send({...rest, token, logged: true})
    },

    async show(req: Request, res: Response){
        //@ts-ignore
        const id = req.userId

        const users = getRepository(User)
        const user = await users.findOneOrFail(id, {
            relations: ['orphanages']
        })

        const {id:number ,password, ...rest} = user

        return res.json(rest)
    }
}