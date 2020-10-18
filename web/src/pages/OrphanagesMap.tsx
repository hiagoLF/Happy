import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {FiPlus, FiArrowRight} from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanages-map.svg'
import '../styles/pages/orphanages-map.css'

import mapIcon from '../utils/mapIcon'
import api from '../services/api'

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string
}

function OrphanagesMap() {

    //Essa é a maneira de criar estados com typescript.
    //Aqui apontamos para ele que criaremos um array de Orphanage
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    //Lógica do useEffect --> Execute a função quando um parâmetro do vetor for alterado
    //Se não tiver nada dentro do vetor, execute só uma vez.
    useEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data)
        })
    }, [])

    console.log(orphanages)

    return (
        <div id='page-map'>
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Iguaí</strong>
                    <span>Bahia</span>
                </footer>
            </aside>

            <Map
                center={[-14.754289,-40.0883447]}
                zoom={15.57}
                style={{width: '100%', height:'100%'}}
            >
                
                {/* Aqui é o TileLayer do OpenStreetMap */}
                {/* <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}

                {/* TileLayer do MapBox */}
                <TileLayer 
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                {orphanages.map(orphanage => (
                    <Marker
                        icon={mapIcon}
                        position={[orphanage.latitude, orphanage.longitude]}
                        key={orphanage.id}
                    >
                        <Popup closeButton={false} minWidth={240} maxWidth={240} className='map-popup'>
                            {orphanage.name}
                            <Link to={`/orphanages/${orphanage.id}`}>
                                <FiArrowRight size={20} color='#FFF'/> 
                            </Link>
                        </Popup>
                    </Marker>
                ))}

            </Map>

            <Link to='/orphanages/create' className='create-orphanage'>
                <FiPlus size={32} color='#FFF'/>
            </Link>
        </div>
    )
}

export default OrphanagesMap