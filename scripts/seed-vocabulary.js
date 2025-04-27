#!/usr/bin/env node

/**
 * This script seeds the database with vocabulary data from a CSV file.
 * It can be run independently of the main seed script.
 * 
 * Usage:
 *   npm run seed-vocabulary
 *   
 * To generate a new vocabulary CSV file:
 *   npm run generate-vocabulary
 */

// Register TypeScript
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2019',
  },
});

// Import the seed function
const { seedVocabulary } = require('../src/lib/seedVocabulary');

// Run the seed function
seedVocabulary()
  .then(() => {
    console.log('Vocabulary seeding completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error seeding vocabulary:', error);
    process.exit(1);
  });
