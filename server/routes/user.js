import express from 'express';
const router = require('express-promise-router')();
import userController from './../controllers/userController';
import { validateBody , schemas } from './../helpers/routeHelpers';
import passport from 'passport';
import passportConf from './../passport';

router.route('/signUp')
  .post(validateBody(schemas.authSchema) , userController.signUp);

router.route('/signIn')
  .post( validateBody(schemas.authSchema),
    passport.authenticate('local' , { session : false}) , 
    userController.signIn);

router.route('/secret')
  .get(passport.authenticate('jwt' , { session : false}), userController.secret)

router.route('/oauth/google')  
  .post(passport.authenticate('googleToken' , { session : false }) , userController.googleOAuth)
export default router;

router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', {session : false}), userController.facebookOAuth)