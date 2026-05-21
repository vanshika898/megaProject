const passport = require('passport');

const GoogleStrategy =
require('passport-google-oauth20').Strategy;

passport.use(
 new GoogleStrategy(
   {
      clientID:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,
      callbackURL:"/auth/google/callback"
   },

   async(accessToken,refreshToken,profile,done)=>{

      try{

         console.log(profile);

         return done(null,profile);

      }
      catch(error){

         return done(error,false);
      }

   }
 )
);


// IMPORTANT PART
passport.serializeUser((user,done)=>{
   done(null,user);
});

passport.deserializeUser((user,done)=>{
   done(null,user);
});

module.exports = passport;