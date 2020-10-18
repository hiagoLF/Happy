import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import api from '../../services/api';

interface OrphanageDataRouteParams {
  position: {
    latitude: number,
    longitude: number,
  }
}

export default function OrphanageData() {
  const route = useRoute()
  const params = route.params as OrphanageDataRouteParams

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekend, setOpenOnWeekend] = useState(true)
  const [images, setImages] = useState<string[]>([])

  const navigation = useNavigation()

  async function handleCreateOrphanage(){
    const {latitude, longitude} = params.position
    
    console.log({
      name,
      about,
      instructions,
      opening_hours,
      open_on_weekend,
      latitude,
      longitude
    })

    const data = new FormData()
    data.append('name', name)
    data.append('about', about)
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekend', String(open_on_weekend))
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any)
      // as any é só pra resolver um probleminha do typescript. por enquanto fica assim
    })

    await api.post('orphanages', data)
    navigation.navigate('OrphanagesMap')
  }

  async function handleSelectImages(){
    //Pegar perissão da câmera
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()

    //Verificar se o acesso a câmera foi concedido
    if( status != 'granted' ) {
      alert('Eita! Precisamos de acesso a suas fotos...')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      //Permitir que o usuário edite as imagens antes de enviar
      allowsEditing: true,
      //quality: Vai de 0 a 1
      quality: 1,
      //Aceitar apenas imagens
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if(result.cancelled){
      return 
    }

    //Aqui só tô trocando o nome uri para image
    const { uri: image } = result
    setImages([...images, image])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        //multiline --> O input terá mais que uma linha
        multiline
        value = {about}
        //Também é possível colocar só setAbout já que ele só recebe um parâmetro
        onChangeText={text => setAbout(text)}
      />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.upLoadedImagesContainer}>
        {images.map(image => (
          <Image
            key={image}
            source={{uri: image}}
            style={styles.upLoadedImage}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={text => setInstructions(text)}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={text => setOpeningHours(text)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch 
          thumbColor="#fff" 
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekend}
          //Aqui é vai definir automativamente se é true ou false e colocar dentro de open_on_wekends
          onValueChange={setOpenOnWeekend}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  upLoadedImagesContainer: {
    flexDirection: 'row'
  },

  upLoadedImage: {
    height: 64,
    width: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})