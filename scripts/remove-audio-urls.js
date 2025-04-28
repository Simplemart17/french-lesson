const fs = require('fs');
const path = require('path');

// Path to the pronunciation exercises data file
const filePath = path.join(__dirname, '..', 'prisma', 'seed', 'data', 'pronunciationExercises.json');

// Read the file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Remove audioUrl field from each item
const updatedData = data.map(item => {
  const { audioUrl, ...rest } = item;
  return rest;
});

// Write the updated data back to the file
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

console.log(`Removed audioUrl field from ${data.length} pronunciation exercises.`);
