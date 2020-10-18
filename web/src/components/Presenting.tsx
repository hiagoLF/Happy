import React from 'react'
import imageLogo from '../images/map-marker.svg'
import textLogo from '../images/Union.png'
import '../styles/components/presenting.css'


export default function Presenting(){
    return(
        <div id='presenting-component'>
            <div id='logo-box'>
                <img id='img-logo' src={imageLogo} alt="Happy"/>
                <img id='text-logo' src={textLogo} alt=""/>
            </div>
            
            <footer>
                <strong>Iguaí</strong>
                <span>Bahia</span>
            </footer>
        </div>
    )
}