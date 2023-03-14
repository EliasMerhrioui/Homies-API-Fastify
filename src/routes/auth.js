const fastify = require('fastify')();
const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = function (fastify, opts, next) {
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
          return res.send({ 
            utilisateur,
            message: "Authentification réussie !" 
          });
        });
  next();
}

