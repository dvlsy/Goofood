const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(request, response, next){
    try{
        const { headers } = request;
        const authHeader = headers.authorization;
        if (!authHeader) throw new Error('Header missing');

        if (!authHeader.startsWith('Bearer ')) throw new Error('Bearer malformed');
        const secret = process.env.SECRET;
        const token = authHeader.slice(7);
        request.user = jwt.verify(token, secret);

        return next();
      } catch (error) {
        console.log('Une erreur s\'est produite', error);
        return response.status(401).send('Not authorized');
      }
}