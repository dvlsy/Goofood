const express = require("express");
const fs = require('fs').promises;
const db = require('../../modules/connectDb');
const { v4: uuidv4 } = require('uuid');
const {verificationUtilisateur,existanceUtilisateurDansUneTable,existanceDonnerDansUneTable} = require('../../modules/module')
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', async (request, response) => {
    const idUtilisateur = request.user.userId

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).json({statusError: 'utilisateur non trouver'})
    }

    const objectAdresse = await db('Adresse')
    .select('*')
    .where('idAdresse', queryUtilisateur.pkIdAdresse)
    .first()

    const utilisateur = {
        idUtilisateur: queryUtilisateur.idUser,
        email: queryUtilisateur.email,
        nom: queryUtilisateur.nom,
        photoDeProfile: queryUtilisateur.photoDeProfile,
        noTelephone: queryUtilisateur.noTelephone,
        adresse: {
            noRue: objectAdresse.noRue ,
            nomRue: objectAdresse.nomRue,
            nomVille: objectAdresse.nomVille,
            province: objectAdresse.province,
            codePostal: objectAdresse.codePostal,
        }
    }
    response.status(200).json( utilisateur);
});

router.put("/", async(request, response) => {
    const idUtilisateur = request.user.userId

    if(!await verificationUtilisateur(idUtilisateur)){
        response.status(404).send({statusError: 'utilisateur non trouver'})
    }

    if(request.body.motDePasse){
        const hash= await bcrypt.hash(request.body.motDePasse, 8);
        request.body.motDePasse = hash
    }

    await db('utilisateurs')
    .update(request.body)
    .where('idUser', request.user.userId)

    return response.status(200).json({ modification: true });
});

router.delete("/", async(request, response) => {
    const idUtilisateur = request.user.userId
    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);
    if(!queryUtilisateur){
        response.status(404).send({statusError: 'utilisateur non trouver'})
    }

    if(await existanceUtilisateurDansUneTable(idUtilisateur,'utilisateur_Reservation','pkUtilisateur')){
        await db('utilisateur_Reservation')
        .where('pkUtilisateur', idUtilisateur)
        .del()
    }


    if(await existanceUtilisateurDansUneTable(idUtilisateur,'RestaurantFavorit','pkUtilisateur')){    
        await db('RestaurantFavorit')
        .where('pkUtilisateur', idUtilisateur)
        .del()
    }
    if(queryUtilisateur.photoDeProfile.includes('default.jpg') && queryUtilisateur.photoDeProfile !== null){
        await db('Utilisateurs')
        .where('idUser', idUtilisateur)
        .del()
        return response.status(200).json({ Delete: true });
    }else{
        fs.unlinkSync(`public${queryUtilisateur.photoDeProfile.substring(33)}`)
        await db('Utilisateurs')
        .where('idUser', idUtilisateur)
        .del()
        return response.status(200).json({ Delete: true });
    }

});

router.put("/updateProfiles", async(request, response) => {
    const photoDeProfile =request.files.photoDeProfile;
    const idUtilisateur = request.user.userId
    let image = '';

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);

    if (!queryUtilisateur) {
        return response.status(404).json({message: 'Cet utilisateur n\'existe pas'});
    }

    if(!request.files){
        return response.status(404).json({message: 'Erreur: Il n\'y a pas de fichier'});
    }

    const uniqueImage = uuidv4();

    photoDeProfile.mv(`./public/photoDEProfile/${uniqueImage}.jpg`);
    image = `https://godffoodapi.herokuapp.com/photoDEProfile/${uniqueImage}.jpg`

    if(image !== ''){
        console.log('je suis dans le if')
        await db('utilisateurs')
        .update({
            photoDEProfile: image
        })
        .where('idUser', request.user.userId)
        return response.status(200).json({urlProfile:image});
    }
})

router.put("/adresse", async(request, response) => {
    const idUtilisateur = request.user.userId

    const queryUtilisateur = await verificationUtilisateur(idUtilisateur);

    console.log(queryUtilisateur)
    if (!queryUtilisateur) {
        return response.status(404).json({message: 'Cet utilisateur n\'existe pas'});
    }

    const adresse = await existanceDonnerDansUneTable('Adresse','idAdresse',queryUtilisateur.pkIdAdresse)
    if(adresse == true){
        const update = await db('Adresse')
        .update(request.body)
        .where('idAdresse', queryUtilisateur.pkIdAdresse)
    
        if(update){
            const adresse = await db('Adresse')
            .select('noRue','nomRue','nomVille','province','codePostal')
            .where('idAdresse',queryUtilisateur.pkIdAdresse)
            .first()

            if(adresse){
                response.status(200).json(adresse);
            }
        }
    }
})
module.exports = router;