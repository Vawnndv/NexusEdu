require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// Passport jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);

        if (!user) {
            return done(null, false);
        }

        done(null, user)
    } catch (error) {
        done(error, false);
    }
}))

// Passport local
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done("Invalid email", false);
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return done("Invalid password", false);
        }

        done(null, user);
    } catch (error) {
        done(error, false);
    }
}))

// Passport Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const existUser = await User.findOne({
            authLoginId: profile?.id,
            typeLogin: "google",
        });

        if (existUser) {
            const updateUser = {
                authLoginToken: accessToken,
            };

            const user = await User.findOneAndUpdate(
                { _id: existUser.id },
                { $set: updateUser },
                { new: true }
            );

            return done(null, user);
        } else {
            const newUser = new User({
                firstName: profile?.name.givenName,
                lastName: profile?.name.familyName,
                email: profile?.emails[0].value,
                image: profile?.photos[0]?.value,
                authLoginId: profile.id,
                authLoginToken: accessToken,
                typeLogin: profile.provider,
                isVerified: true,
            })

            const user = await newUser.save();
            return done(null, user);
        }
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/users/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        const existUser = await User.findOne({
            authLoginId: profile?.id,
            typeLogin: "facebook",
        });

        if (existUser) {
            const updateUser = {
                authLoginToken: accessToken,
            };

            const user = await User.findOneAndUpdate(
                { _id: existUser.id },
                { $set: updateUser },
                { new: true }
            );

            return done(null, user);
        } else {
            const newUser = new User({
                firstName: profile?.name.givenName ? profile?.name.givenName : profile?.displayName.split(" ")[0],
                lastName: profile?.name.familyName ? profile?.name.familyName : profile?.displayName.split(" ")[profile?.displayName.split(" ").length - 1],
                email: profile?.emails[0].value,
                image: profile?.photos[0]?.value,
                authLoginId: profile.id,
                authLoginToken: accessToken,
                typeLogin: profile.provider,
                isVerified: true,
            })

            const user = await newUser.save();
            return done(null, user);
        }
    }
));