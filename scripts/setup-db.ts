import { prisma } from '../src/lib/prisma';
import { seedDatabase } from '../src/lib/seed';

async function main() {
  try {
    console.log('Running database setup...');

    // Create database tables
    console.log('Running migrations...');
    // In a real app, we'd use Prisma migrations
    // For this example, we'll use prisma.pushDb() to create the tables
    // await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS french_lesson;`;
    
    // Seed the database
    console.log('Seeding database...');
    await seedDatabase();

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 