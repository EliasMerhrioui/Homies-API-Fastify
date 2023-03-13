const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

module.exports = function (fastify, opts, next) {
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
  fastify.get('/utilisateurs', async (req, res) => {
    try {
      const utilisateurs = await prisma.utilisateur.findMany();
      res.send(utilisateurs);
    } catch (error) {
      console.error(error);
      res.status(500).send('Une erreur est survenue lors de la récupération des utilisateurs.');
    }
  });

  next();
};
