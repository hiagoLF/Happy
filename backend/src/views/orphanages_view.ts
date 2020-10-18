//Aqui serão as instruções necessárias para ele enviar as imagens em visualização para o front-end
import Orphanage from '../models/orphanages'
import imagesView from './images_view'

export default {
    render(orphanage: Orphanage) {
        return {
            id: orphanage.id,
            name: orphanage.name,
            latitude: orphanage.latitude,
            longitude: orphanage.longitude,
            about: orphanage.about,
            instructions: orphanage.instructions,
            opening_hours: orphanage.opening_hours,
            open_on_weekend: orphanage.open_on_weekend,
            authorized: orphanage.authorized,
            images: imagesView.renderMany(orphanage.images),
            
        }
    },

    renderMany(orphanages: Orphanage[]){
        return orphanages.map(orphanage => this.render(orphanage))
    }
}