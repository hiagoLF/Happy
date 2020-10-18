import multer from 'multer'


// path --> Forma de fazer caminhos dentro do node
import path from 'path'

export default {
    storage: multer.diskStorage({
        //Para onde os arquivos irão
        //Path.join vai fazer os caminhos pra qualquer sistema operacional
        destination: path.join(__dirname, '..', '..', 'uploads'),

        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`

            //null porque o primeiro parâmetro seria um erro. E aqui não da nenhum erro
            cb(null, fileName)
        }
    })
}