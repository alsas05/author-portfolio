const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function checkAndSeed() {
  try {
    const userCount = await prisma.user.count();
    const chroniclesBook = await prisma.book.findUnique({
      where: { slug: 'chronicles-of-heart-a-loves-tapestry' },
    });

    // If no user exists OR if the database has not yet been seeded with the author's real books and blogs
    if (userCount === 0 || !chroniclesBook) {
      console.log('🌱 Syncing latest author content and database seed...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
    } else {
      console.log(`✨ Database already contains ${userCount} user(s) and latest content. Skipping seed.`);
    }
  } catch (err) {
    console.error('Database initialization check error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed();
