import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import SideBar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {

  const history = useHistory()

  const [position, setPosition] = useState({latitude: 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpenigHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [token, setToken] = useState('')


  useEffect(() => {
    getUserToken()
  }, [])

  async function getUserToken(){
    const token = localStorage.getItem('token') as string
    setToken(token)
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      //createObjectURL cria uma url virtual para uma imagem no próprio navegador
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  async function handleSubmit(event: FormEvent){
    //preventDefault serve para que a página não seja recarregada quando o botão submit for acionado.
    event.preventDefault()

    const {latitude, longitude} = position

    //FormaData é o multipart form que enviaremos
    const data = new FormData()
    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekend', String(open_on_weekends))
    //Como é um array de imagens, eu envio uma de cada vez com o forEach
    images.forEach(image => {
      data.append('images', image)
    })

    console.log({
      name,
      about,
      latitude,
      longitude,
      opening_hours,
      open_on_weekends,
      images
    })

    await api.post('orphanages', data, {headers: {
      authorization: `Bearer ${token}`
    }})

    alert('Sucesso! Seu orfanato será analizado pelos nossos administradores')

    history.push('/app')

  }

  function handleMapClick(event: LeafletMouseEvent){

    const {lat, lng} = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng,
    })

    console.log(event.latlng)
  }

  return (
    <div id="page-create-orphanage">

      <SideBar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-14.754289,-40.0883447]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude != 0 
                && <Marker interactive={false} icon={mapIcon} position={[position.latitude,position.longitude]}/>}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {previewImages.map(image => (
                  <img key={image} src={image} alt={name}></img>
                ))}

                <label htmlFor='image[]' className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                
                
              </div>
              {/* Input para colocar arquivos */}
              <input onChange={handleSelectImages} multiple type="file" id='image[]'/>

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpenigHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >Sim</button>
                <button
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
