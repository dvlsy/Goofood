const express = require("express");
const fs = require('fs').promises;
const db = require('../../modules/connectDb');
const {verificationUtilisateur,existanceDonnerDansUneTable} = require('../../modules/module')
const {schemaGetAllReservations} = require('../../modules/schema')
const router = express.Router();

router.get('/all', async (request, response) => {
    const idUtilisateur = request.user.userId

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    const reservationQuery = await db('Utilisateur_Reservation')
    .select('*')
    .where('pkUtilisateur', idUtilisateur)

    if(!reservationQuery.length){
        response.status(404).json({statusError: 'utilisateur n\'as pas de reservation'})
    }

    response.status(200).json(await schemaGetAllReservations(reservationQuery,idUtilisateur));
});

router.get('/', async (request, response) => {
    const idUtilisateur = request.user.userId
    const {idreservation} = request.query

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    const reservationQuery = await db('Utilisateur_Reservation')
    .select('*')
    .where('pkUtilisateur', idUtilisateur)
    .andWhere('pkReservation',idreservation)

    if(!reservationQuery.length){
        response.status(404).json({statusError: 'utilisateur n\'as pas de reservation'})
    }

    const reservationSchema = await schemaGetAllReservations(reservationQuery,idUtilisateur)
    response.status(200).json(reservationSchema[0]);
}); 

router.post('/', async (request, response) => {
    const idUtilisateur = request.user.userId
    const {idRestaurant} = request.query

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    if(await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant ) === false){
        response.status(404).json({statusError: 'restaurant pas trouvé'})
    }
    if(!request.body.dateReservation || !request.body.nbPerson || !request.body.note){
        response.status(404).json({statusError: 'impossible de faire la reservation veillez verifier les champs'})
    }

    const insertReservation = await db('Reservations')
    .insert({
        dateReservation :request.body.dateReservation,
        nbPerson : request.body.nbPerson,
        note: request.body.note,
        pkIdRestaurant: idRestaurant,
        pkIdUtilisateur: idUtilisateur,
    })

    if(!insertReservation){
        response.status(400).json({statusError: 'impossible de faire la reservation'})
    }
    response.status(402).json({reservation: true})
})


router.put('/', async (request, response) => {
    const idUtilisateur = request.user.userId
    const {idRestaurant,idReservation} = request.query

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    if(await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant ) === false){
        response.status(404).json({statusError: 'restaurant pas trouvé'})
    }
    const reservationQuery = await db('Utilisateur_Reservation')
    .select('*')
    .where('pkUtilisateur', idUtilisateur)
    .andWhere('pkReservation',idReservation)

    if(!reservationQuery.length){
        response.status(404).json({statusError: 'utilisateur n\'as pas de reservation'})
    }
    
    const insertReservation = await db('Reservations')
    .update(request.body)
    .where('idReservation',idReservation)
    if(!insertReservation){
        response.status(400).json({statusError: 'impossible de faire la reservation'})
    }
    response.status(402).json({reservation: true})
})

router.delete('/', async (request, response) => {
    const idUtilisateur = request.user.userId
    const {idRestaurant,idReservation} = request.query

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    if(await existanceDonnerDansUneTable('Restaurants','idRestaurant',idRestaurant ) === false){
        response.status(404).json({statusError: 'restaurant pas trouvé'})
    }
    const reservationQuery = await db('Utilisateur_Reservation')
    .select('*')
    .where('pkUtilisateur', idUtilisateur)
    .andWhere('pkReservation',idReservation)

    if(!reservationQuery.length){
        response.status(404).json({statusError: 'utilisateur n\'as pas de reservation'})
    }

    await db('Utilisateur_Reservation')
    .where('pkUtilisateur', idUtilisateur)
    .del()
    
     await db('Reservations')
    .where('idReservation',idReservation)
    .del()
    response.status(402).json({Delete: true})
})
module.exports = router;