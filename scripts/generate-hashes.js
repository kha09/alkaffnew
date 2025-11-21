const bcrypt = require('bcrypt');

async function generateHashes() {
  const passwords = {
    'admin123': await bcrypt.hash('admin123', 10),
    'agent123': await bcrypt.hash('agent123', 10),
    'student123': await bcrypt.hash('student123', 10),
    'password123': await bcrypt.hash('password123', 10)
  };
  
  console.log('Generated password hashes:');
  Object.entries(passwords).forEach(([password, hash]) => {
    console.log(`${password}: ${hash}`);
  });
}

generateHashes().catch(console.error);
