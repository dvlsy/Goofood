const express = require("express");
const bcrypt = require('bcrypt');
const db = require('../../modules/connectDb');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secret = process.env.SECRET;
/*
 * Pour tester:
   curl -X POST -H "Content-Type: application/json" \
   -d '{"password":"abc123", "email":"johnDoe@hotmail.com"}' \
   http://localhost:3000/api/token
 */
   router.post('/', async (request, response) => {
    const {email, motDePasse} = request.body;
  
    const user = await db('Utilisateurs').where('email', email).first();
    if(!user){
      return response.status(401).json({message: 'Vous n\'etes pas autorise'});
    }
    
    const result = await bcrypt.compare(motDePasse, user.motDePasse);
    if(motDePasse !== user.MotDePasse && result == false){
        return response.status(401).json({message: 'Vous n\'etes pas autorise'});
    }

    /*
    if(password !== user.password){
      return response.status(401).json({message: 'Vous n\'etes pas autorise'});
    }
    */
    
    const token = jwt.sign({ userId: user.idUser }, secret);
    
    response.status(200).json({ token });
  });

  router.get('/test', async (request, response) => {
    query = await db('test').select('*')
    response.status(200).json({ query });
});

  module.exports = router;