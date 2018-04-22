import passport from 'passport';
import { Strategy as JWTStrategy } from "passport-jwt";
import { ExtractJwt } from 'passport-jwt';
import { Strategy as  LocalStrategy } from 'passport-local';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import FacebookTokenStrategy from 'passport-facebook-token';

import { JWT_SECRET , oauth } from './configurations/index';
import User from './models/user';
import { access } from 'fs';

// JSON WEB TOKEN STRATEGY
passport.use(new JWTStrategy({
  jwtFromRequest : ExtractJwt.fromHeader('authorization'),
  secretOrKey : JWT_SECRET
},async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    if (!user) {
      return done(null, false);
    }
    done(null, user)    
  }catch(error){
    done(error, false);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
   usernameField : 'email'
}, async(email , password, done) => {
  try {
    const user = await User.findOne({"local.email" : email});
    if( !user ) {
      done(null, false);
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
       return done(null, false);
    }
    done(null, user);
  }catch(error) {
    done(error, false)
  }
}));

// Google Oauth Strategy

passport.use("googleToken", new GooglePlusTokenStrategy({
  clientID : '206514026116-npjkfo7daqq74jdedl1ltjtk6duri99t.apps.googleusercontent.com',
  clientSecret : '5SVwlfuxS8S338oZ56w-H7S1'
} , async (accessToken , refreshToken , profile , done) => {
    
    try {
      const existingUser = await User.findOne({"google.id" : profile.id});
      if ( existingUser ) {
        done(null, existingUser);
      }
  
      //   If its new account
      const newUser = new User({
        method : "google",
        google : {
          id : profile.id,
          email : profile.emails[0].value
        }
      });
  
      await newUser.save();
      done(null , newUser);
    } catch(error) {
        done(error , false , error.message);
    }
}));


passport.use('facebookToken', new FacebookTokenStrategy({
  clientID : oauth.facebook.clientID, 
  clientSecret : oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('profile : ', profile);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
  }catch(error) {
    done(error);
  }
})); 