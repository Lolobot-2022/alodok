const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken');
const ObjectID = require("mongoose").Types.ObjectId;

const User = require('../models/user.model');


//CRUD
exports.createUser = (req, res, next) => {
  const user = new User({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password:req.body.password,
    picture: req.body.picture,
    bio:req.body.bio,
    followers: req.body.followers,
    following: req.body.following,
    likes:req.body.likes
  });
  user.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyUser = (req, res, next) => {
  const user = new User({
    _id: req.params.id,
    pseudo: req.body.pseudo,
    email: req.body.email,
    password:req.body.password,
    picture: req.body.picture,
    bio:req.body.bio,
    followers: req.body.followers,
    following: req.body.following,
    likes:req.body.likes
  });
  User.updateOne({_id: req.params.id}, user).then(
    () => {
      res.status(201).json({
        message: 'User updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllUsers = (req, res, next) => {
  User.find().then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Authentification
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user =new User({
      pseudo:req.body.pseudo,
      email:req.body.email,
      password:hash
    });
    user.save()
     .then(()=>res.status(201).json({message:'Ou anregistre!' }))
     .catch(error =>res.status(400).json({error}));
  })
  .catch(error =>res.status(500).json({error}));
  
};

exports.login = (req, res, next) => {
  User.findOne({email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'idantifyan w oubyen modpas ou enkorèk'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Idantifyan w oubyen modpas ou enkorèk' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                      
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};


//follow/unfollow
module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    //add to the follower list
    await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ).clone();
    //add to followwing list
    await User.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    ).clone();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//ne plus suivre un utilisateur
module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    //add to the follower list
    await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ).clone();
    //add to followwing list
    await User.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    ).clone();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};