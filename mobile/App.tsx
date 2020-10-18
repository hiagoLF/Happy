import React from 'react'

import Routes from './src/routes'

//Precisamos importar useFonts para ajudar no carregamento da fonte.
import {useFonts} from 'expo-font'
import {Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold} from '@expo-google-fonts/nunito'

export default function App() {

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  })

  //Isso aqui vai ficar verificando se as fontes já carregaram.
  if(!fontsLoaded){
    return null
  }
  return <Routes />
}

