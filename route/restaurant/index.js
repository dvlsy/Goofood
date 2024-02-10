const express = require("express");
const fs = require('fs').promises;
const db = require('../../modules/connectDb');
const {verificationUtilisateur,existanceDonnerDansUneTable} = require('../../modules/module')
const {schemaGetOneRestaurants,schemaGetAllRestaurants} = require('../../modules/schema')
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.put("/updatelogoRestaurant", async(request, response) => {

    const logoImage =request.files.logoImage;
    const {idRestaurant} = request.query
    let image = '';
    const queryRestaurant =  await db('Restaurants')
    .select('idRestaurant')
    .where('idRestaurant', idRestaurant)
    .first()
    if (!queryRestaurant) {
        response.status(404).json({erreur: 'Restaurant n\'existe pas'});
    }

    if(!request.files){
        response.status(404).json({erreur: 'Erreur: Il n\'y a pas de fichier'});
    }

    const uniqueImage = uuidv4();

    logoImage.mv(`./public/restaurants/${uniqueImage}.jpg`);
    image = `https://godffoodapi.herokuapp.com/restaurants/${uniqueImage}.jpg`

    if(image !== ''){
        await db('Restaurants')
        .update({
            logoImage: image
        })
        .where('idRestaurant', idRestaurant)
        response.status(200).json({urllogoImage:image});
    }
})

router.get('/', async (request, response) => {
    const {idRestaurant} = request.query

    const restaurantQuery = await db('Restaurants')
    .select('*')
    .where('idRestaurant', idRestaurant)
    .first()

    if(!restaurantQuery){
        response.status(404).json({statusError: 'le restaurant pas trouvé'})
    }

    response.status(200).json(await schemaGetOneRestaurants(response, restaurantQuery, idRestaurant));
});



router.get('/', async (request, response) => {
    
    const restaurantQuery = await db('Restaurants')
    .select('*')
    
    if(!restaurantQuery){
    response.status(404).json({statusError: 'les restaurants ne sont pas retourné'})
    }

    response.status(200).json(await schemaGetAllRestaurants(response,restaurantQuery));
});

router.put("/adresse", async(request, response) => {
    const {idRestaurant} = request.query;

    const restaurant = await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant)

    if (restaurant === false) {
        return response.status(404).json({message: 'Restaurant n\'existe pas'});
    }

    const restaurantQuery = await db('Restaurants')
    .select('pkIdAdresse')
    .where('idRestaurant',idRestaurant)
    .first()

    const adresse = await existanceDonnerDansUneTable('Adresse','idAdresse',restaurantQuery.pkIdAdresse)
    if(adresse == true){
        const update = await db('Adresse')
        .update(request.body)
        .where('idAdresse', restaurantQuery.pkIdAdresse)
    
        if(update){
            const adresse = await db('Adresse')
            .select('noRue','nomRue','nomVille','province','codePostal')
            .where('idAdresse',restaurantQuery.pkIdAdresse)
            .first()

            if(adresse){
                response.status(200).json(adresse);
            }
        }
    }
})
module.exports = router;