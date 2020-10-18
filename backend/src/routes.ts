import {Router} from 'express'
import multer from 'multer'

import OrphanagesControllers from './controllers/OrphanagesControllers'

import uploadConfig from './config/upload'
import UsersController from './controllers/UsersController'
import User from './models/user'

const routes = Router()
const upload = multer(uploadConfig)

//Listar orfanatos
routes.get('/orphanages', OrphanagesControllers.index)

//Buscar um usuário no banco de dados
routes.get('/orphanages/:id', OrphanagesControllers.show)

//Criar um usuário
routes.post('/user', UsersController.create)

//Login
routes.post('/user/login', UsersController.login)

//--------------------
//Verificação do token
routes.use(require('./middlewares/auth'))

//Mostrar dados do usuario que enviou o token
routes.get('/user/info', UsersController.show)

//Criar orfanato pelo usuário com token
routes.post('/orphanages', upload.array('images') ,OrphanagesControllers.create)
//Em upload.array ele vai pegar as imagens que estarão no campo images

routes.delete('/orphanages', OrphanagesControllers.delete)

export default routes