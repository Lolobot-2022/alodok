const User = require('../models/user.model');

exports.createUser = (req, res, next) => {
  const user = new User({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password:req.body.password,
    picture: req.body.picture,
    company:req.body.company,
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
    company:req.body.company,
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