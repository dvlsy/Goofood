const db = require('./connectDb');
module.exports = {
    schemaGetfavoris: async function(response, restaurantQuery){
    
    let objectRestaurant = {
        idRestaurant: 0,
        nom: "" ,
        logoImage: "",
        description: "",
        categories: {
            idCategoriesRestaurant: 0,
            nom: ""
        }
    }
    const tabRestaurant = []

    
    for(let r = 0; r< restaurantQuery.length; r++) {
        const categories = await db('CategoriesRestaurant')
        .select('*')
        .where('idCategoriesRestaurant',restaurantQuery[r].pkIdCategRestaurant)
        .first()

        if(!categories){
            return response.status(404).json({erreur: `categorie du restaurant ${restaurantQuery[r].nom} 
            avec l'id: ${restaurantQuery[r].idRestaurant} n\'est pas trouvé`})
        }

        objectRestaurant.categories.idCategoriesRestaurant = categories.idCategoriesRestaurant
        objectRestaurant.categories.nom = categories.nom

        objectRestaurant.idRestaurant = restaurantQuery[r].idRestaurant
        objectRestaurant.nom = restaurantQuery[r].nom
        objectRestaurant.logoImage = restaurantQuery[r].logoImage
        objectRestaurant.description = restaurantQuery[r].description
        tabRestaurant.push(objectRestaurant)

        objectRestaurant = {
            idRestaurant: 0,
            nom: "" ,
            logoImage: "",
            description: "",
            categories: {
                idCategoriesRestaurant: 0,
                nom: ""
            }
        }
    }
        if(tabRestaurant.length > 0){
            return tabRestaurant
        }
        else{
            return response.status(404).json({erreur: `donner non retrouvé`})
        }

    }, 
    schemaGetAllRestaurants: async function (response, restaurantQuery){
        let objectRestaurant = {
            idRestaurant: 0,
            noTelephone: "",
            nom: '',
            logoImage: '',
            description: '',
            capaciterMaximal: '',
            categories: {
                idCategoriesRestaurant: 0,
                nom: ''
            },
            adresse: {
            noRue: '',
                nomRue: '',
                nomVille: '',
            province: '',
                codePostal: ''
            }
        }
        const tabRestaurant = []
          // traitement des données
        for(let r = 0; r < restaurantQuery.length; r++) {

            // objet restaurant
            objectRestaurant.idRestaurant = restaurantQuery[r].idRestaurant
            objectRestaurant.noTelephone = restaurantQuery[r].noPhone
            objectRestaurant.nom = restaurantQuery[r].nom
            objectRestaurant.logoImage = restaurantQuery[r].logoImage
            objectRestaurant.description = restaurantQuery[r].description
            objectRestaurant.capaciterMaximal = restaurantQuery[r].nbTables

            // Objet categorie
            const categories = await db('CategoriesRestaurant')
            .select('*')
            .where('idCategoriesRestaurant',restaurantQuery[r].pkIdCategRestaurant)
            .first()
    
            if(!categories){
                return response.status(404).json({statusError: `categorie du restaurant ${restaurantQuery[r].nom} 
                avec l'id: ${restaurantQuery[r].idRestaurant} n\'est pas trouvé`})
            }
    
            objectRestaurant.categories.idCategoriesRestaurant = categories.idCategoriesRestaurant
            objectRestaurant.categories.nom = categories.nom
    
            //objet address
            const addresse = await db('Adresse')
            .select('*')
            .where('idAdresse',restaurantQuery[r].pkIdAdresse)
            .first()
    
            if(!addresse){
                return response.status(404).json({statusError: `l'adresse du restaurant ${restaurantQuery[r].nom} 
                avec l'id: ${restaurantQuery[r].idRestaurant} n\'est pas trouvé`})
            }
    
            objectRestaurant.adresse.noRue = addresse.noRue
            objectRestaurant.adresse.nomRue = addresse.nomRue
            objectRestaurant.adresse.nomVille = addresse.nomVille
            objectRestaurant.adresse.province = addresse.province
            objectRestaurant.adresse.codePostal = addresse.codePostal
        
            tabRestaurant.push(objectRestaurant)

            // vider les données pour eviter les doblur
            objectRestaurant = {
                idRestaurant: 0,
                noTelephone: "",
                nom: '',
                logoImage: '',
                description: '',
                capaciterMaximal: '',
                categories: {
                    idCategoriesRestaurant: 0,
                    nom: ''
                },
                adresse: {
                noRue: '',
                    nomRue: '',
                    nomVille: '',
                province: '',
                    codePostal: ''
                }
            }
            
        }
        if(tabRestaurant.length > 0){
            return tabRestaurant
        }
        else{
            return response.status(404).json({erreur: `donner non retrouvé`})
        }
    },
    schemaGetOneRestaurants: async function (response, restaurantQuery,idRestaurant){
        console.log(response)
        let objectRestaurant = {
            idRestaurant: 0,
            noTelephone: "",
            nom: '',
            logoImage: '',
            description: '',
            capaciterMaximal: '',
            menu: {
                sectionAliments: null
            },
            categories: {
                idCategoriesRestaurant: 0,
                nom: ''
            },
            adresse: {
            noRue: '',
                nomRue: '',
                nomVille: '',
            province: '',
                codePostal: ''
            }
        }
          // traitement des données
    
            // objet restaurant
            objectRestaurant.idRestaurant = restaurantQuery.idRestaurant
            objectRestaurant.noTelephone = restaurantQuery.noPhone
            objectRestaurant.nom = restaurantQuery.nom
            objectRestaurant.logoImage = restaurantQuery.logoImage
            objectRestaurant.description = restaurantQuery.description
            objectRestaurant.capaciterMaximal = restaurantQuery.nbTables
    
            // Objet categorie
            const categories = await db('CategoriesRestaurant')
            .select('*')
            .where('idCategoriesRestaurant',restaurantQuery.pkIdCategRestaurant)
            .first()
    
            if(!categories){
                return response.status(404).json({statusError: `categorie du restaurant ${restaurantQuery.nom} 
                avec l'id: ${restaurantQuery.idRestaurant} n\'est pas trouvé`})
            }
    
            objectRestaurant.categories.idCategoriesRestaurant = categories.idCategoriesRestaurant
            objectRestaurant.categories.nom = categories.nom
    
            //objet address
            const addresse = await db('Adresse')
            .select('*')
            .where('idAdresse',restaurantQuery.pkIdAdresse)
            .first()
    
            if(!addresse){
                return response.status(404).json({statusError: `l'adresse du restaurant ${restaurantQuery.nom} 
                avec l'id: ${restaurantQuery.idRestaurant} n\'est pas trouvé`})
            }
    
            objectRestaurant.adresse.noRue = addresse.noRue
            objectRestaurant.adresse.nomRue = addresse.nomRue
            objectRestaurant.adresse.nomVille = addresse.nomVille
            objectRestaurant.adresse.province = addresse.province
            objectRestaurant.adresse.codePostal = addresse.codePostal
        
            // Menu 
            let objectAliment = {
                idAliment: 0,
                nom: '',
                prix: 0,
                quantiter: 0,
                description: ''    
            }
        
            let objetSection ={
                idSectionAliment: 0,
                nom: "",
                aliments:null
            } 
            
            const tabSection = [];
            let tabAliment = [];
    
            let lastIdSection = 0;
            
            const menu = await db('Menu')
            .where('pkRestaurant',idRestaurant)
    
            if(!menu.length){
                return response.status(404).json({statusError: `Le menu du restaurant ${restaurantQuery.nom} 
                avec l'id: ${restaurantQuery.idRestaurant} n\'est pas trouvé`})
            }
    
            for(let m = 0; m < menu.length; m++){
    
                if(lastIdSection != menu[m].pkSectionAliments){
                    
                    const section = await db('SectionAliments')
                    .where('idSectionAliment',menu[m].pkSectionAliments)
                    .first()
    
                    if(!section){
                        return response.status(404).json({statusError: `Les section du restaurant ${restaurantQuery.nom} 
                        avec l'id: ${restaurantQuery.idRestaurant} n\'est pas trouvé`})
                    }
    
                    const alimentSection = await db('Menu')
                    .join('SectionAliments', 'Menu.pkSectionAliments', 'SectionAliments.idSectionAliment')
                    .join('Aliments','Menu.pkIdAliment','Aliments.idAliment')
                    .where('idSectionAliment',section.idSectionAliment)
                    .andWhere('pkRestaurant',idRestaurant)
                    .select('idAliment','Aliments.nom','prix','qte as quantiter','description')

                    if(!alimentSection){
                        return response.status(404).json({statusError: `Les plats du restaurant ${restaurantQuery.nom} 
                        avec l'id: ${restaurantQuery.idRestaurant} n\'est pas trouvé`})
                    }
    
                    for(let a = 0; a < alimentSection.length; a++){
                        
                        objectAliment.idAliment = alimentSection[a].idAliment
                        objectAliment.nom = alimentSection[a].nom
                        objectAliment.prix = alimentSection[a].prix
                        objectAliment.description = alimentSection[a].description
                        objectAliment.quantiter = alimentSection[a].quantiter
    
                        tabAliment.push(objectAliment)
                        objectAliment = {
                            idAliment: 0,
                            nom: '',
                            prix: 0,
                            quantiter: 0,
                            description: ''    
                        }
                    }
    
                    if(tabAliment.length > 0){
                        objetSection.idSectionAliment = section.idSectionAliment
                        objetSection.nom = section.nom
                        objetSection.aliments = tabAliment
                    }
    
                    tabSection.push(objetSection)
                    tabAliment= []
                    objetSection ={
                        idSectionAliment: 0,
                        nom: "",
                        aliments:null
                    } 
    
                    lastIdSection = menu[m].pkSectionAliments
                }
            }
    
            objectRestaurant.menu.sectionAliments = tabSection
        return objectRestaurant    
    },
    schemaGetAdress: async function (response, addresseQuery){

    },
    schemaGetAllReservations: async function (reservationQuery, idUtilisateur){
        let objectAdresse = {
            noRue:'',
            nomRue:'',
            nomVille:'',
            province:'',
            codePostal:'' 
        }
    
        let objReservation = {
            idUtilisateur: 0,
            idreservation: 0,
            dateReservation:'',
            nombredePersonne: 0,
            idRestaurant: 0,
            nomRestaurant: '',
            adresseRestaurant: null,
            note: 0
        }
    
        let tabReservation = []
    
        for(let r = 0 ; r < reservationQuery.length; r++){
            
            const reservation = await db('Reservations')
            .select('idReservation','dateReservation','nbPerson as nombredePersonne','note','pkIdRestaurant as idRestaurant','pkIdUtilisateur as idUtilisateur','note')
            .where('idReservation',reservationQuery[r].pkReservation)
            .first()
    
            const restaurant = await db('Restaurants')
            .where('idRestaurant',reservation.idRestaurant)
            .first()
    
            const address = await db('Adresse')
            .where('idAdresse',restaurant.pkIdAdresse)
            .first()
    
            objectAdresse.noRue = address.noRue
            objectAdresse.nomVille = address.nomVille
            objectAdresse.province = address.province
            objectAdresse.codePostal = address.codePostal
    
            objReservation.adresseRestaurant = objectAdresse
            objReservation.idUtilisateur = idUtilisateur
            objReservation.idRestaurant = restaurant.idRestaurant
            objReservation.dateReservation = reservation.dateReservation
            objReservation.idreservation = reservation.idReservation
            objReservation.adresseRestaurant = objectAdresse
            objReservation.nombredePersonne = reservation.nombredePersonne
            objReservation.nomRestaurant = restaurant.nom
            objReservation.note = reservation.note[0]
    
            tabReservation.push(objReservation)
            objReservation = {
                idUtilisateur: 0,
                idreservation: 0,
                dateReservation:'',
                nombredePersonne: 0,
                idRestaurant: 0,
                nomRestaurant: '',
                adresseRestaurant: null,
                note: 0
            }
            objectAdresse = {
                noRue:'',
                nomRue:'',
                nomVille:'',
                province:'',
                codePostal:'' 
            }
        }
        return tabReservation
    }
}