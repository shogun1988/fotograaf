const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERNAME = process.env.AUTH_USERNAME || 'demo';
const AUTH_CONFIG_PATH = path.join(__dirname, 'auth-config.json');
const DEFAULT_PASSWORD_HASH = '$2a$12$DVR0XVPMatBRrXv.rB21oemF9BNjjCSLlSief8awuemN41VQglumG';

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(AUTH_CONFIG_PATH, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

function writeConfig(config) {
  const temporaryPath = `${AUTH_CONFIG_PATH}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporaryPath, AUTH_CONFIG_PATH);
}

let passwordHash = process.env.AUTH_PASSWORD_HASH || readConfig().passwordHash || DEFAULT_PASSWORD_HASH;

module.exports = {
  USERNAME,
  verifyPassword: (password) => bcrypt.compare(String(password || ''), passwordHash),
  updatePassword: async (currentPassword, newPassword) => {
    const currentPasswordCorrect = await bcrypt.compare(String(currentPassword || ''), passwordHash);

    if (!currentPasswordCorrect) {
      return false;
    }

    const nextPasswordHash = await bcrypt.hash(String(newPassword), 12);
    const config = readConfig();
    config.passwordHash = nextPasswordHash;
    writeConfig(config);
    passwordHash = nextPasswordHash;
    return true;
  }
};
