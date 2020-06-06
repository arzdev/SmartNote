const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cbu = "http://localhost:5000/auth/google/callback"
const client_secret = "OtwU_IQcyJInAVQjtOTx6Ruk"
const client_id = "758782554681-f2unkbc8tduhuo8k0jmspvnp863jafi2.apps.googleusercontent.com"


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID: client_id, 
            clientSecret: client_secret,
            callbackURL: cbu 
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};
