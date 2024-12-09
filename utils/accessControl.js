const fs = require('fs');

const USERS_FILE = 'users.txt';

let adminId = null;
let allowedUsers = new Set();

function initUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '', 'utf8');
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  const lines = data.split('\n').map(l => l.trim());
  if (lines.length > 0 && lines[0] !== '') {
    adminId = lines[0];
  }

  const userLines = lines.slice(1).filter(l => l !== '');
  allowedUsers = new Set(userLines);
}

function saveUsers() {
  const adminLine = adminId ? adminId : '';
  const userLines = Array.from(allowedUsers);
  const fileContent = [adminLine, ...userLines].join('\n');
  fs.writeFileSync(USERS_FILE, fileContent, 'utf8');
}

function getAdmin() {
  return adminId;
}

function setAdmin(userId) {
  adminId = userId;
  saveUsers();
  console.log(`Set admin to user: ${userId}`);
}

function isAdmin(userId) {
  return adminId && adminId === userId;
}

function isAllowedUser(userId) {
  // The admin should inherently have access, but to keep logic consistent:
  if (isAdmin(userId)) return true;
  return allowedUsers.has(userId);
}

function addAllowedUser(userId) {
  // Do not add admin as a duplicate line if they're already admin
  if (isAdmin(userId) || allowedUsers.has(userId)) return;
  allowedUsers.add(userId);
  saveUsers();
}

module.exports = {
  initUsers,
  getAdmin,
  setAdmin,
  isAdmin,
  isAllowedUser,
  addAllowedUser
};
