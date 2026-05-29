const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { findOrCreateOAuthUser } = require('./users');

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function configureGoogle() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${baseUrl}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email,
            name: profile.displayName,
            username: email?.split('@')[0],
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

function configureGitHub() {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) return;

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${baseUrl}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const primaryEmail =
            profile.emails?.find((entry) => entry.primary)?.value ||
            profile.emails?.[0]?.value ||
            `${profile.id}+${profile.username}@users.noreply.github.com`;

          const user = await findOrCreateOAuthUser({
            provider: 'github',
            providerId: String(profile.id),
            email: primaryEmail,
            name: profile.displayName || profile.username,
            username: profile.username,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

configureGoogle();
configureGitHub();

module.exports = passport;
