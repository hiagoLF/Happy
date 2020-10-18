import React, {useState} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { useFocusEffect, useNavigation } from '@react-navigation/native';


//Feather --> Biblioteca de ícones no expo
import { Feather } from '@expo/vector-icons'

//Nas plataformas mobile é importante ter as imagens em 3 dimensões
//Com isso o React vai escolher a melhor imagem para a densidade de pixel do dispositivo
//Também é importante que as imagens não sejam SVG pois os dispositivos não se dão bem com esse formato.
import mapMarker from '../images/happy_icon/map-marker.png'
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

export default function OrphanagesMap(){
    const navigation = useNavigation()
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    //Esse hook é executado toda vez que o usuário volta para essa tela.
    //Isso vai garantir que o mapa seja atualizado quando o usuário cadastrar um novo orfanato
    useFocusEffect(() => {
      api.get('orphanages').then(response => {
        setOrphanages(response.data)
      })
    })
    
      function handleNavigatorToOrphanageDetails(id: number){
        //Passando parâmetros para a janela que será aberta
        navigation.navigate('OrphanageDetail', {id})
      }

      function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition')
      }

      return (
        <View style={styles.container}>
          <MapView
            //Este provider serve para que seja utilizado os mapas do google mesmo quando executado num dispositivo android
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: -14.7543826,
              longitude: -40.0921432,
              //lat e lng Delta é um cáculo que reflete o zoom
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
          >

            {orphanages.map(orphanage => (
              <Marker
                key={orphanage.id}
                icon={mapMarker}
                /* Posicionar o callout --> Estudar melhor essas medições */
                calloutAnchor={{
                  y: 0.7,
                  x: 2.1,
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
              >
                {/* Callout é o PopUp do React-Native.
                    tooltip: Criar estilização a partir do zero sem estilo prédefinido
                    --> Se quiser colocar estilização, melhor deixar ele como true */}
                <Callout tooltip={true} onPress={() => handleNavigatorToOrphanageDetails(orphanage.id)} >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}

          </MapView>
    
          <View style={styles.footer}>
            <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
            <RectButton
              style={styles.createOrphanageButton}
              onPress={handleNavigateToCreateOrphanage}>
              <Feather name='plus' size={20} color='#FFF'/>
            </RectButton>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      //Uma maneira de referenciar a dimensão da tela sem ter que colocar 100%
      width: Dimensions.get('window').width,
      //Porém pra altura ficou cortado aqui no meu celular, então coloquei 100% mesmo
      //height: Dimensions.get('window').height,
      height: '100%',
    },
    calloutContainer:{
      width: 160,
      height: 45,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
    calloutText:{
      color: '#0089a5',
      fontSize: 14,
      /* As fontes carregadas podem ser colocadas assim ou passando o próprio nome dela mesmo */
      fontFamily: 'Nunito_700Bold'
    },
    footer:{
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      
      /* Sombreamento para componenetes Android */
      elevation: 3
    },
    footerText: {
      color: '#8fa7b3',
      fontFamily: 'Nunito_700Bold'
    },
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
  });
  