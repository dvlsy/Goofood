//dependance
const OpenApiValidator = require('express-openapi-validator');
const authMiddleware = require('../modules/auth-middleware');
const { Router } = require('express');
const token = require("./token");
const register = require("./register");
const restaurant = require("./restaurant");
const adresse = require("./adresse");
const utilisateur =require("./utilisateur");
const favoris = require("./favoris");
const reservation = require("./reservation");
const categories = require("./categories");
//instanciation des dependance
const router = Router();

// route fonctionne sans la validation YAML

router.use("/adresse",adresse);
//validation de chaque route en fonction de YAML 
router.use(
    OpenApiValidator.middleware({
        apiSpec: "./specs/api.yaml",
        validateRequests: true,
        validateResponse: true,
    }),
);

//utilisation des route avec ou sans middleware
router.use("/token",token);
router.use("/register",register);
router.use("/utilisateur",authMiddleware,utilisateur);
router.use("/favoris",authMiddleware,favoris);
router.use("/categories",categories)
router.use("/restaurant",restaurant);
router.use('/reservation',authMiddleware,reservation);
module.exports = router;