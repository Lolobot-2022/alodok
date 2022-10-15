const express= require ('express');
const router=express.Router();


//const auth=require('../middleware/auth');

const userCtrl =require('../controllers/user.controller');

//router pour CRUD
router.get('/',   userCtrl.getAllUsers);
router.post('/', userCtrl.createUser);
router.get('/:id', userCtrl.getOneUser);
router.put('/:id',  userCtrl.modifyUser);
router.delete('/:id',  userCtrl.deleteUser);

//router pour authentification
router.post('/signup',  userCtrl.signup);
router.post('/login',  userCtrl.login);

  
module.exports=router;