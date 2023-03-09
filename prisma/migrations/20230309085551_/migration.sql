-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom_utilisateur" TEXT NOT NULL,
    "prenom_utilisateur" TEXT NOT NULL,
    "email_utilisateur" TEXT NOT NULL,
    "password_utilisateur" TEXT NOT NULL,
    "adresse_utilisateur" TEXT NOT NULL,
    "ville_utilisateur" TEXT NOT NULL,
    "pays_utilisateur" TEXT NOT NULL,
    "tel_utilisateur" TEXT NOT NULL,
    "salt" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id_commande" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL,
    "statut_commande" TEXT NOT NULL,
    "montant_total_commande" DOUBLE PRECISION NOT NULL,
    "adresse_livraison" TEXT NOT NULL,
    "adresse_facturation" TEXT NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id_commande")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id_produit" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categorie_produit" TEXT NOT NULL,
    "nom_produit" TEXT NOT NULL,
    "description_produit" TEXT NOT NULL,
    "prix_produit" DOUBLE PRECISION NOT NULL,
    "quantite_produit" INTEGER NOT NULL,
    "image_produit" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "categorieId" INTEGER,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "Panier" (
    "id_panier" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "id_produit" INTEGER NOT NULL,
    "quantite_produit" INTEGER NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panier_pkey" PRIMARY KEY ("id_panier")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id_categorie" SERIAL NOT NULL,
    "nom_categorie" TEXT NOT NULL,
    "description_categorie" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id_categorie")
);

-- CreateTable
CREATE TABLE "Actualite" (
    "id_actus" SERIAL NOT NULL,
    "titre_actus" TEXT NOT NULL,
    "contenu_actus" TEXT NOT NULL,
    "date_actus" TIMESTAMP(3) NOT NULL,
    "id_admin" INTEGER NOT NULL,

    CONSTRAINT "Actualite_pkey" PRIMARY KEY ("id_actus")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id_contact" SERIAL NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "nom_contact" TEXT NOT NULL,
    "email_contact" TEXT NOT NULL,
    "objet_contact" TEXT NOT NULL,
    "message_contact" TEXT NOT NULL,
    "date_contact" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id_contact")
);

-- CreateTable
CREATE TABLE "Administrateur" (
    "id_admin" SERIAL NOT NULL,
    "nom_admin" TEXT NOT NULL,
    "prenom_admin" TEXT NOT NULL,
    "email_admin" TEXT NOT NULL,
    "password_admin" TEXT NOT NULL,

    CONSTRAINT "Administrateur_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Partenaire" (
    "id_partenaire" SERIAL NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "nom_partenaire" TEXT NOT NULL,
    "description_partenaire" TEXT,
    "logo_partenaire" TEXT,
    "siteweb_partenaire" TEXT,
    "contact_partenaire" TEXT,

    CONSTRAINT "Partenaire_pkey" PRIMARY KEY ("id_partenaire")
);

-- CreateTable
CREATE TABLE "_AdministrateurToUtilisateur" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_utilisateur_key" ON "Utilisateur"("email_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Administrateur_email_admin_key" ON "Administrateur"("email_admin");

-- CreateIndex
CREATE UNIQUE INDEX "_AdministrateurToUtilisateur_AB_unique" ON "_AdministrateurToUtilisateur"("A", "B");

-- CreateIndex
CREATE INDEX "_AdministrateurToUtilisateur_B_index" ON "_AdministrateurToUtilisateur"("B");

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id_categorie") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panier" ADD CONSTRAINT "Panier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panier" ADD CONSTRAINT "Panier_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actualite" ADD CONSTRAINT "Actualite_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Administrateur"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Administrateur"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partenaire" ADD CONSTRAINT "Partenaire_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Administrateur"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdministrateurToUtilisateur" ADD CONSTRAINT "_AdministrateurToUtilisateur_A_fkey" FOREIGN KEY ("A") REFERENCES "Administrateur"("id_admin") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdministrateurToUtilisateur" ADD CONSTRAINT "_AdministrateurToUtilisateur_B_fkey" FOREIGN KEY ("B") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
