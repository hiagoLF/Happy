import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import '../styles/pages/login-form.css'

import Presenting from '../components/Presenting'
import api from '../services/api'
import { useHistory } from 'react-router-dom'

interface User {
    data:{
        name: string,
        user_type: number,
        email: string,
        token: string,
        logged: boolean,
    }
}

export default function LoginForm(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginAvaliable, setLoginAvaliable] = useState(false)
    const [loadingLogin, setloadingLogin] = useState('not-yet')
    const history = useHistory()

    //Quando email e password se alteram
    useEffect(() => {
        if(email.length > 2 && password.length > 2){
            setLoginAvaliable(true)
        }else{
            setLoginAvaliable(false)
        }
    }, [email, password])

    async function handleLogin(event: FormEvent) {
        event.preventDefault()
        
        //Requisição no backend
        setloadingLogin('progress')
        const response = await api.post('user/login', {email, password})
        if(response){
            setloadingLogin('ok')
            localStorage.setItem('token', response.data.token)
            history.push('/app')
        }
    }

    return (
        <div id='login-page'>
            {/* Apresentação */}
            <Presenting />
            <div id='form-content'>
                <form id='form-box' onSubmit={handleLogin}>
                    <h1 id='top'>Fazer Login</h1>

                    <div className='input-block'>
                        <label htmlFor="email">E-mail</label>
                        <input
                            name='email'
                            type="text"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            />
                    </div>

                    <div className='input-block'>
                        <label htmlFor="">Senha</label>
                        <input
                            name='password'
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            />
                    </div>

                    <div className='options-block'>
                        <div id='remember-box'>
                            <input type="checkbox"/>
                            <label htmlFor="">Lembrar-me</label>
                        </div>
                    </div>

                    {
                        loginAvaliable ? (
                            <button
                                id='avaliable-button'
                            >Entrar</button>
                        ): (
                            <button id='blocked-button'>Entrar</button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}