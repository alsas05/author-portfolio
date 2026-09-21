const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function checkAndSeed() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 No admin user found. Running initial database seed...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
    } else {
      console.log(`✨ Database already contains ${userCount} user(s). Skipping seed to preserve data.`);
    }
  } catch (err) {
    console.error('Database initialization check error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed();
