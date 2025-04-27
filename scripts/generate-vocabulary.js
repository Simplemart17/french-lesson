#!/usr/bin/env node

/**
 * This script generates a comprehensive vocabulary CSV file
 * that can be used to seed the database.
 * 
 * Usage:
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

// Import the generate function
const { generateComprehensiveVocabularyCSV } = require('../src/lib/seedVocabulary');

// Run the generate function
generateComprehensiveVocabularyCSV();
console.log('Vocabulary CSV generation completed');
