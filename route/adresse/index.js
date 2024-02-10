const express = require("express");
const db = require('../../modules/connectDb');
const router = express.Router();
/*
 * Pour tester:
   curl -X POST -H "Content-Type: application/json" \
   http://localhost:3000/api/restaurants
 */
   router.get('/Restaurant', async (request, response) => {
        const id = request.query.idRestaurant;
  
        const adresse = await db('Adresse').select("Adresse.noRue", "Adresse.nomRue", "Adresse.nomVille", "Adresse.province", "Adresse.codePostal").join('Restaurants', 'Adresse.IdAdresse', '=', 'Restaurants.FkIdAdresse').where("Restaurants.IdRestaurant", id);
    
        response.status(200).json({ adresse });
  });

  router.get('/Utilisateur', async (request, response) => {
    const id = request.query.idUtilisateur;
  
    const adresse = await db('Adresse').select("Adresse.noRue", "Adresse.nomRue", "Adresse.nomVille", "Adresse.province", "Adresse.codePostal").join('Utilisateurs', 'Adresse.IdAdresse', '=', 'Utilisateurs.FkIdAdresse').where("Utilisateurs.IdUtilisateur", id);
    
    response.status(200).json({ adresse });
  });
  
  module.exports = router;