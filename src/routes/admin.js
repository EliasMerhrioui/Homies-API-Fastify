const fastify = require('fastify')();
const bcrypt = require('bcrypt');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

// Endpoint pour récupérer tous les utilisateurs
module.exports = function (fastify, opts, next) {
  fastify.get('/administrateurs', async (req, reply) => {
    try {
      // Utilise le modèle Prisma pour récupérer tous les utilisateurs
      const administrateurs = await prisma.administrateur.findMany();
      reply.send(administrateurs)
    } catch (error) {
      console.error(error)
      reply.status(500).send('Une erreur est survenue lors de la récupération des administrateurs.')
    }
  });

    fastify.post('/administrateurs/:email', async (req, res) => {
        const { email } = req.params; // Récupérer l'adresse email de l'administrateur à ajouter depuis les paramètres d'URL
        try {
          const response = await axios.get('http://localhost:3000/utilisateurs');
          const utilisateurs = response.data; // Récupérer la liste des utilisateurs
          
          const administrateursResponse = await axios.get('http://127.0.0.1:3000/administrateurs');
          let administrateurs = administrateursResponse.data; // Récupérer la liste des administrateurs
          
          const utilisateur = utilisateurs.find(u => u.email_utilisateur === email); // Trouver l'utilisateur correspondant à l'adresse email
          
          if (administrateurs == 0) {
           console.log(utilisateur.nom_utilisateur)
            const nouvelAdmin = await prisma.administrateur.create({
              data: {
               id_admin: 1,
               nom_admin: utilisateur.nom_utilisateur,
                prenom_admin: utilisateur.prenom_utilisateur,
                email_admin: utilisateur.email_utilisateur,
                password_admin: utilisateur.password_utilisateur,
              },
            });
      
            // Renvoyer la réponse avec l'utilisateur inscrit
            return res.send(nouvelAdmin);
          } else {
            const utilisateur = utilisateurs.find(u => u.email_utilisateur === email); // Trouver l'utilisateur correspondant à l'adresse email
            if (!utilisateur) {
              return res.status(404).send({ message: 'Utilisateur non trouvé' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
            }
            
            const emailExistant = administrateurs.some(admin => admin.email_admin === email);
            if (emailExistant) {
              return res.status(400).send({ message: 'Cette adresse email existe déjà' }); // Retourner une erreur si l'adresse email existe déjà
            }
      
            const newAdmin = {
              id_admin: 1, // Générer un nouvel identifiant pour le premier administrateur
              nom_admin: utilisateur.nom_utilisateur,
              prenom_admin: utilisateur.prenom_utilisateur,
              email_admin: email,
              password_admin: utilisateur.password_utilisateur
            };
      
            administrateurs = [newAdmin]; // Remplacer la liste vide des administrateurs par une liste contenant le nouvel administrateur
            await axios.put('http://127.0.0.1:3000/administrateurs', { Administrateurs: administrateurs }); // Mettre à jour la liste des administrateurs
            
            return res.send({ message: 'Administrateur ajouté avec succès', admin: newAdmin }); // Retourner la confirmation de l'ajout de l'administrateur   
          }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de la récupération des utilisateurs ou des administrateurs' });
        }
      });
  next();
}


