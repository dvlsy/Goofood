const db = require('./connectDb').default;
module.exports = {
    verificationUtilisateur: async function(idUser){
        const verification = await db('utilisateurs')
        .select('*')
        .where('idUser', idUser)
        .first()
        return verification
    },
    existanceUtilisateurDansUneTable: async function(idUser, nomTable,nomPkUtilisateur){
        let existance = false;

            const query = await db(`${nomTable}`)
            .select('*')
            .where(nomPkUtilisateur, idUser)
            .first()

        if(query){
            return existance = true;
        }
        return existance
    }, 
    existanceDonnerDansUneTable: async function(nomTable,nomPropriete,valeurDeLaProprieter){
        let existance = false;

            const query = await db(`${nomTable}`)
            .select('*')
            .where(nomPropriete, valeurDeLaProprieter)
            .first()

        if(query){
            return existance = true;
        }
        return existance
    },     
};
