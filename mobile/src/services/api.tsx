import axios from 'axios'

const api = axios.create({
    //Como o app está rodando em outro dispositivo, não colocamos localhost:3333
    //Aqui acessamos pelo endereço de IP do computador que está rodando o backend
    //A porta é a mesma que colocamos lá no Node.
    baseURL: 'http://192.168.0.106:3333'
})

export default api