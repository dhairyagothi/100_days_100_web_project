const User = require('../models/User');

async function ensureUniqueUsername(baseUsername) {
  let finalUsername = baseUsername.slice(0, 30) || `user_${Date.now()}`;
  let counter = 1;

  while (await User.findOne({ username: finalUsername })) {
    finalUsername = `${baseUsername.slice(0, 24)}${counter}`;
    counter += 1;
  }

  return finalUsername;
}

async function findOrCreateOAuthUser({ provider, providerId, email, name, username }) {
  const idField = provider === 'google' ? 'googleId' : 'githubId';

  let user = await User.findOne({ [idField]: providerId });
  if (user) return user;

  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  if (normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });
    if (user) {
      user[idField] = providerId;
      if (!user.name && name) user.name = name;
      await user.save();
      return user;
    }
  }

  const safeBase =
    (username || normalizedEmail?.split('@')[0] || `user_${providerId.slice(0, 8)}`)
      .replace(/[^a-zA-Z0-9_]/g, '') || `user_${Date.now()}`;

  const finalUsername = await ensureUniqueUsername(safeBase);

  return User.create({
    name: name || finalUsername,
    username: finalUsername,
    email: normalizedEmail || `${providerId}@${provider}.oauth.local`,
    [idField]: providerId,
  });
}

module.exports = { findOrCreateOAuthUser };
