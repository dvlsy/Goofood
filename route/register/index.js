const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../modules/connectDb');
const router = express.Router();

/*
 * Pour tester:
  curl -X POST -H "Content-Type: application/json" \
  -d '
  {"motDePasse":"123456",
    "email":"bluis@email.com", 
    "nom":"Luis", 
    "noTelephone":"514-666-6666", 
    "adresse": {
      "noRue": "45236",
      "nomRue": "Rue Lanvier",
      "nomVille": "Montreal", 
      "province": "QC", 
      "codePostal": "H4C 6N5"}}' \
  http://localhost:3000/register
 */
router.post('/', async (request, response) => {

    const {email, motDePasse, noTelephone, nom, adresse} = request.body;

    const hashedPassword = await bcrypt.hash(motDePasse, 8);

    let idAdresse = 0;
    let utilisateur;
    const user = await db('Utilisateurs').where('email', email).first();
    
    if(user){
      return response.status(401).json({message: 'Vous n\'etes pas autorise'});
    };

    // verification si l'adresse existe deja.
    if (adresse){
      const verificationAdresse = await db('Adresse')
      .where('noRue',adresse.noRue)
      .andWhere('nomRue', adresse.nomRue)
      .andWhere('nomVille', adresse.nomVille)
      .andWhere('province', adresse.province)
      .andWhere('codePostal', adresse.codePostal).first()
      if(verificationAdresse){
        idAdresse = verificationAdresse.idAdresse
      }else{
        const insertionAdress = await db('Adresse').insert({
          noRue: adresse.noRue,
          nomRue: adresse.nomRue,
          nomVille: adresse.nomVille,
          province: adresse.province,
          codePostal: adresse.codePostal,
        });
        const query = await db('Adresse').max('idAdresse as idAdresse').first()
        idAdresse = query.idAdresse
      }
    }
    else{
      return response.status(401).json({message:"Votre adresse est requise"})
    }


    const insertUtilisateur = await db('Utilisateurs').insert( {
        motDePasse: hashedPassword,
        nom: nom,
        noTelephone: noTelephone,
        email: email,
        pkIdAdresse: idAdresse,
        photoDeProfile: 'https://godffoodapi.herokuapp.com/photoDEProfile/default.jpg'
    });  
    
    if(insertUtilisateur){
      utilisateur = await db('Utilisateurs')
      .select('email','nom').where('nom', nom).first();
    }
    response.status(201).json({"email":utilisateur.email,"nom":utilisateur.nom});
    
  });

  module.exports = router;