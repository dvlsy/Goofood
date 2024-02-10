const express = require("express");
const db = require('../../modules/connectDb');
const {verificationUtilisateur,existanceDonnerDansUneTable} = require('../../modules/module')
const {schemaGetfavoris} = require('../../modules/schema')
const router = express.Router();

router.post('/', async (request, response) => {
    const  {idRestaurant} = request.query 
    const idUtilisateur = request.user.userId

    if(!await verificationUtilisateur(idRestaurant)){
        response.status(404).json({erreur: 'utilisateur non trouver'})
    }

    if(await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant) === false){
        response.status(404).json({erreur: 'Restaurant non trouver'})
    }

    const insert = await db('RestaurantFavorit').insert( {
        pkUtilisateur: idUtilisateur,
        pkRestaurant: idRestaurant
    });  

    if(!insert){
        response.status(400).json({erreur: 'impossible d\'ajouter les favoris'})
    }

    response.status(201).json({insertionFavorie:true});
})

router.get('/', async (request, response) => {
    const idUtilisateur = request.user.userId

    if(!await verificationUtilisateur(idUtilisateur)){
        response.status(404).json({erreur: 'utilisateur non trouver'})
    }

    const restaurants = await db('Restaurants').select('*')


    response.status(201).json(await schemaGetfavoris(response,restaurants));
})

router.delete('/', async (request, response) => {
    const idUtilisateur = request.user.userId
    const {idRestaurant} = request.query

    if(!await verificationUtilisateur(idUtilisateur)){
        response.status(404).json({message: 'utilisateur non trouver'})
    }

    if(!await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant)){
        response.status(404).json({message: 'Restaurant non trouver'})
    }

    const supprimer = await db('RestaurantFavorit')
    .where('pkRestaurant', idRestaurant)
    .del()
    
    if(!supprimer){
        response.status(404).json({message: 'suppression impossible'})
    }
    response.status(200).json({Delete: true});
})


module.exports = router;