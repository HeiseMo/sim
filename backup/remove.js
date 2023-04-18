const fs = require('fs');

// Function to remove the complexity key-value pair from nested objects
function removeComplexity(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      removeComplexity(obj[key]);
    }
  }
  delete obj.complexity;
}

// Read the traitsDB.json file
fs.readFile('traitDB-bare.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the traitsDB.json file:', err);
        return;
    }

    // Parse the JSON data
    const traitsDB = JSON.parse(data);

    // Remove the complexity key-value pair from the entire JSON object
    removeComplexity(traitsDB);

    // If needed, you can save the updated traitsDB back to the file:
    fs.writeFile('traitDB-bare.json', JSON.stringify(traitsDB, null, 2), 'utf8', err => {
        if (err) {
            console.error('Error writing the updated traitsDB.json file:', err);
        } else {
            console.log('Updated traitsDB.json file, removed complexity.');
        }
    });
});
