const fs = require('fs');
const path = require('path');

// Path to the lessons data file
const filePath = path.join(__dirname, '..', 'prisma', 'seed', 'data', 'lessons.json');

// Read the file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Remove audioUrl field from each section in each lesson
const updatedData = data.map(lesson => {
  // Update sections
  const updatedSections = lesson.sections.map(section => {
    const { audioUrl, ...rest } = section;
    return rest;
  });
  
  // Return updated lesson
  return {
    ...lesson,
    sections: updatedSections
  };
});

// Write the updated data back to the file
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

// Count the number of sections processed
let sectionCount = 0;
data.forEach(lesson => {
  sectionCount += lesson.sections.length;
});

console.log(`Removed audioUrl field from ${sectionCount} lesson sections.`);
