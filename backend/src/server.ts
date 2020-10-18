import express from 'express'
import 'express-async-errors'
//espress-async-errors deve ser importado após express para que possa capturar os erros asíncronos

import cors from 'cors'
import './database/connection'
import routes from './routes'
import path from 'path'
import errorHandler from './errors/handler'


const app = express()

app.use(cors())

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use(routes)

//Tratamento de erros asíncronos
app.use(errorHandler)

app.listen(3333)