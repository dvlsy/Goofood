//dependance
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const swaggerui= require("swagger-ui-express");
const fileUpload = require('express-fileupload');
const YAML = require('yamljs');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const router = require('./route');

const app = express();
// manipulation des fichier
app.use(cors());

// instanciation des dependance
const swaggerDocument = YAML.load('./specs/api.yaml');
app.use(fileUpload({
    createParentPath: true
}));

// manipulation des paths
app.use(express.static('public'));
app.use(express.static('specs'));

// manipulation des methodes http
app.use(bodyParser.json());

///route pour l'api
app.use('/api', router,swaggerui.serve, swaggerui.setup(swaggerDocument))


///route pour la documentation
app.use('/', function(req, res, next){
    swaggerDocument.host = req.get('host');
    req.swaggerDoc = swaggerDocument;
    next();
}, swaggerui.serve, swaggerui.setup());

app.listen(port, () => {
    console.log(`L'API peut maintenant recevoir des requêtes: http://localhost:${port}`);
});

