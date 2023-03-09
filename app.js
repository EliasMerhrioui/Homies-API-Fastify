const fastify = require('fastify')();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

// Endpoint pour inscrire un nouvel utilisateur
fastify.post('/utilisateurs', async (req, res) => {
  const { nom_utilisateur, prenom_utilisateur, email_utilisateur, password_utilisateur, adresse_utilisateur, ville_utilisateur, pays_utilisateur, tel_utilisateur } = req.body;
  
  // Vérifier si l'utilisateur n'existe pas déjà
  const utilisateurExistant = await prisma.utilisateur.findUnique({
    where: {
      email_utilisateur,
    },
  });
  
  if (utilisateurExistant) {
    return res.status(400).send({ message: 'Cet utilisateur existe déjà' });
  }
  
  // Générer un sel pour le hachage du mot de passe
  const salt = await bcrypt.genSalt(10);
  
  // Hacher le mot de passe avec le sel généré
  const hashedPassword = await bcrypt.hash(password_utilisateur, salt);
  
  // Insérer l'utilisateur dans la base de données
  const nouvelUtilisateur = await prisma.utilisateur.create({
    data: {
      nom_utilisateur,
      prenom_utilisateur,
      email_utilisateur,
      password_utilisateur: hashedPassword,
      adresse_utilisateur,
      ville_utilisateur,
      pays_utilisateur,
      tel_utilisateur,
      salt,
    },
  });
  
  // Renvoyer la réponse avec l'utilisateur inscrit
  return res.send(nouvelUtilisateur);
});

// Endpoint pour récupérer tous les utilisateurs
fastify.get('/utilisateurs', async (req, reply) => {
  try {
    // Utilise le modèle Prisma pour récupérer tous les utilisateurs
    const utilisateurs = await prisma.utilisateur.findMany();
    reply.send(utilisateurs)
  } catch (error) {
    console.error(error)
    reply.status(500).send('Une erreur est survenue lors de la récupération des utilisateurs.')
  }
});



fastify.post('/login', async (req, res) => {
  const { email_utilisateur, password_utilisateur } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const utilisateur = await prisma.utilisateur.findUnique({
    where: {
      email_utilisateur: email_utilisateur,
    },
  });

  // Vérification de l'existence de l'utilisateur
  if (!utilisateur) {
    return res.status(401).send({ message: "L'email ou le mot de passe est incorrect." });
  }

  // Vérification du mot de passe
  const isPasswordValid = await bcrypt.compare(password_utilisateur, utilisateur.password_utilisateur);

  if (!isPasswordValid) {
    return res.status(401).send({ message: "L'email ou le mot de passe est incorrect." });
  }

  // Si tout est OK, retourner un token d'authentification (ici, un simple message)
  return res.send({ message: "Authentification réussie !" });
});



// Endpoint pour récupérer tous les administrateurs
fastify.get('/administrateurs', async (req, reply) => {
  try {
    // Utilise le modèle Prisma pour récupérer tous les administrateurs
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
      console.log(newAdmin);

      administrateurs = [newAdmin]; // Remplacer la liste vide des administrateurs par une liste contenant le nouvel administrateur
      await axios.put('http://127.0.0.1:3000/administrateurs', { Administrateurs: administrateurs }); // Mettre à jour la liste des administrateurs
      
      return res.send({ message: 'Administrateur ajouté avec succès', admin: newAdmin }); // Retourner la confirmation de l'ajout de l'administrateur   
    
    }
      
  
    
    
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Une erreur est survenue lors de la récupération des utilisateurs ou des administrateurs' });
  }
});



fastify.listen({
  port: 3000,
  host: 'localhost'
}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running at http://localhost:3000');
});