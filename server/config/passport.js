import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; 
import passport from 'passport';

import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`, 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value; 

        const existingUser = await User.findOne({ email }); 

        if (existingUser) {
            // user registered using email and password
            if (!existingUser.googleId) {
                return done(null, false, { message: 'email_exists!'}); 
            }

            // google user -> log them in 
            return done(null, existingUser);
        }

        // new user — create account
        const newUser = await User.create({
            name: profile.displayName,
            email,
            password: 'google-oauth', // placeholder
            googleId: profile.id,
            isVerified: true, // google already verified the email
        });

        return done(null, newUser);
    } catch (err) {
        return done(err); 
    }
})); 

export default passport; 