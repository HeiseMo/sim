const fs = require('fs');

// Read the traitsDB.json file
fs.readFile('traitDB.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the traitsDB.json file:', err);
        return;
    }

    // Parse the JSON data
    const traitsDB = JSON.parse(data);

    function stringToHashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash;
    }

    function padWithZeroes(number, length) {
        let str = String(number);
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function generateOHC(traitName, complexityFactor) {
        const baseCodeLength = 8;
        const baseHash = Math.abs(stringToHashCode(traitName));
        const baseCode = padWithZeroes(baseHash, baseCodeLength).substr(0, baseCodeLength);

        let modifiedCode = '';
        for (let i = 0; i < baseCode.length; i++) {
            modifiedCode += baseCode[i];
            if (complexityFactor > 1 && i % complexityFactor === 0) {
                modifiedCode += String.fromCharCode('A'.charCodeAt(0) + (i % 26));
            }
        }

        // Repeat the modified code based on the complexity factor
        modifiedCode = modifiedCode.repeat(Math.ceil(complexityFactor));

        // Limit the length of the OHC based on the complexity factor
        const maxLength = baseCodeLength + complexityFactor * 2;
        modifiedCode = modifiedCode.substr(0, maxLength);

        return modifiedCode;
    }
    // Iterate through the pathways and traits
    for (const pathway in traitsDB) {
        traitsDB[pathway].forEach(traitObj => {
            // Generate the OHC for each trait and store it in the trait object
            traitObj.ohcStrand = generateOHC(traitObj.trait, traitObj.complexity);
        });
    }

    // Log the updated traitsDB with generated OHCs
    console.log(traitsDB);

    //How many traits
    function countTraitObjects(obj) {
        let count = 0;
      
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            count += countTraitObjects(obj[key]);
          }
        }
      
        if (obj.hasOwnProperty('trait')) {
          count++;
        }
      
        return count;
      }
      
      fs.readFile('traitDB.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the traitsDB.json file:', err);
          return;
        }
        const traitsDB = JSON.parse(data);
        const traitCount = countTraitObjects(traitsDB);
        console.log('Number of objects with a "trait" key:', traitCount);
      });

    // If needed, you can save the updated traitsDB back to the file:
    fs.writeFile('traitDB.json', JSON.stringify(traitsDB, null, 2), 'utf8', err => {
        if (err) {
            console.error('Error writing the updated traitsDB.json file:', err);
        } else {
            console.log('Updated traitsDB.json file with OHCs.');
        }
    });
});