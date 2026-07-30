// Run with: node audit-security.js
const fs = require('fs');
const path = require('path');

console.log('🔒 Security Audit\n');

// Check 1: .env.local in .gitignore
const gitignore = fs.readFileSync('.gitignore', 'utf8');
if (gitignore.includes('.env.local')) {
  console.log('✅ .env.local is in .gitignore');
} else {
  console.log('❌ CRITICAL: .env.local is NOT in .gitignore');
  process.exit(1);
}

// Check 2: No console logs of env vars
const srcFiles = fs.readdirSync('src', { recursive: true })
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let foundLeak = false;
srcFiles.forEach(file => {
  const content = fs.readFileSync(path.join('src', file), 'utf8');
  if (content.includes('console.log') && content.includes('VITE_')) {
    console.log(`❌ Potential leak in ${file}`);
    foundLeak = true;
  }
});

if (!foundLeak) {
  console.log('✅ No environment variable leaks found');
}

// Check 3: vercel.json exists
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json exists');
} else {
  console.log('❌ Missing vercel.json');
}

console.log('\n🎉 Audit complete!');