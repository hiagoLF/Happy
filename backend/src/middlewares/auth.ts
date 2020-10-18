import {Request, Response, NextFunction} from 'express'
import {VerifyErrors, DecodeOptions} from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

const authConfig = require('../config/authConfig.json')

module.exports = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization as string

    //Existe alguma header authorization?
    if(!authHeader){
        return res.status(401).send({error: 'No token provided'})
    }

    //Essa tem duas partes?
    const parts = authHeader.split(' ')
    if(parts.length !== 2){
        return res.status(401).send({error: 'Token Error'})
    }

    //A primeira parte é Bearer?
    if(parts[0] !== 'Bearer'){
        return res.status(401).send({error: 'Token Malformated'})
    }

    jwt.verify(parts[1], authConfig.JWTSecret, (err:any, decoded:any) => {
        if(err) return res.status(401).send({error: 'Invalid Token'})

        //@ts-ignore
        req.userId = decoded.id

        return next()
    })
    
}