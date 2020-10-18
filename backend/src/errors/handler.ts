//Nesse arquivo tratamos os erros
import {ErrorRequestHandler, response} from 'express'

//Aqui utilizaremos o yup só para verificar se o erro foi de validação 
import {ValidationError} from 'yup'

interface ValidationErrors {
    [key: string]: string[]
}

//Tipagem: ErrorRequestHandler
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if(error instanceof ValidationError){
        let errors: ValidationErrors = {}

        error.inner.forEach(err => {
            errors[err.path] = err.errors
        })

        //Status 400 --> Bad Request
        return res.status(400).json({message: 'Validation fails', errors})
    }
    
    console.error(error)

    //Status 500 --> Erro interno
    res.status(500).json({message: 'Internal server error'})
}

export default errorHandler;
