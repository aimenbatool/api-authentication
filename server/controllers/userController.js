import JWT from 'jsonwebtoken';

import User from './../models/user';
import { JWT_SECRET } from './../configurations';

const userController = {

}
const signToken = user => {
  return JWT.sign({
    iss: 'aimenbatool',
    sub : user.id,
    iat : new Date().getTime(),
    exp : new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);
}

userController.signUp = async (req, res, next) => {
  const { email, password } = req.value.body;

  const foundUser = await User.findOne({ "local.email" : email });
  if(foundUser) {
    return res.status(403).json({
      message : "Email is already registered."
    })
  }
  const newUser = new User({ 
    method : "local",
    "local.email" : email,
    "local.password" : password 
  });
  await newUser.save();

  const token = signToken(newUser);

  res.status(200).json({
    token
  })
}

userController.signIn = async (req, res, next) => {
  const token = signToken(req.user);
  res.status(200).json({
    token
  })
}

userController.googleOAuth = async (req, res, next) => {
  const token = signToken(req.user);
  res.status(200).json({
    token
  })
}

userController.secret = async (req, res, next ) => {
  res.json({
    secret : 'resource'
  })
}

userController.facebookOAuth = async (req, res, next) => {
  const token = signToken(req.user);
  res.status(200).json({
    token
  })
}


export default userController;