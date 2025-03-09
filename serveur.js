const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Pour parser le JSON

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // utilisateur par défaut de XAMPP
    password: '', // mot de passe vide par défaut
    database: 'gestion_eleves'
});

// Connexion à la base de données
db.connect(err => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour ajouter un élève
app.post('/students', (req, res) => {
    const { nom, prenom, sexe, parcours, matricule, date_naissance } = req.body;
    const sql = 'INSERT INTO eleves (nom, prenom, sexe, parcours, matricule, date_naissance) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nom, prenom, sexe, parcours, matricule, date_naissance], (err, result) => {
        if (err) throw err;
        res.status(201).send({
            id: result.insertId,
            nom,
            prenom,
            sexe,
            parcours,
            matricule,
            date_naissance
        });
    });
});

// Route pour récupérer tous les élèves
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM eleves';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });
});

// Route pour modifier un élève
app.put('/students/:id', (req, res) => {
    const id = req.params.id;
    const { nom, prenom, sexe, parcours, matricule, date_naissance } = req.body;
    const sql = 'UPDATE eleves SET nom = ?, prenom = ?, sexe = ?, parcours = ?, matricule = ?, date_naissance = ? WHERE id = ?';
    
    db.query(sql, [nom, prenom, sexe, parcours, matricule, date_naissance, id], (err, result) => {
        if (err) throw err;
        res.status(200).send({ message: 'Élève modifié' });
    });
});

// Route pour supprimer un élève
app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM eleves WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.status(200).send({ message: 'Élève supprimé' });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}/`);
});