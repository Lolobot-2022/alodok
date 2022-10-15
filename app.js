const express = require('express');
const mongoose = require('mongoose');

const User= require('./models/user.model');

mongoose.connect('mongodb+srv://lolobot:lolo.alo22@clusteralodok.begiaw9.mongodb.net/alodok-mern?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Koneksyon a MongoDB reyisi !'))
  .catch(() => console.log('Koneksyon a MongoDB echwe !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  //CRUD Post avec Methode save
  app.post('/api/user', (req, res, next) => {
    //delete req.body._id;
    const user = new User({
      ...req.body
    });
    user.save()
      .then(() => res.status(201).json({ message: 'Objè anrejistre !'}))
      .catch(error => res.status(400).json({ error }));
  });

  //CRUD Update avec methode updateOne
  app.put('/api/user/:id', (req, res, next) => {
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objè modifye!'}))
      .catch(error => res.status(400).json({ error }));
  });

  //CRUD delete avec methode deleteOne
  app.delete('/api/user/:id', (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objè siprime!'}))
      .catch(error => res.status(400).json({ error }));
  });

  //CRUD follow un utilisateur avec idToFollow
  

  //CRUD Find an user by Id
  //Select moins password pour cacher le password de l'utilisateur
  app.get('/api/user/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id }).select("-password")
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).json({ error }));
  });

  //CRUD all users
  app.use('/api/user', (req, res, next) => {
    User.find().select("-password")
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
  });
  
module.exports = app;