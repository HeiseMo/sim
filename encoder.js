// encoder.js
const fs = require('fs');

// 
// Helper function to convert decimal to base 6
function decimalToBase6(decimal) {
    let base6 = '';
    while (decimal > 0) {
        const remainder = decimal % 6;
        base6 = remainder.toString() + base6;
        decimal = Math.floor(decimal / 6);
    }
    return base6;
}

function capitalize(category) {
    return category[0].toUpperCase() + category.slice(1);
}

function processTraits(traits, traitDB) {
    let ohcList = [];

    for (const traitCategory in traits) {
        if (traits.hasOwnProperty(traitCategory)) {
            const capitalizedCategory = capitalize(traitCategory);
            const traitData = traits[traitCategory];

            if (Array.isArray(traitData)) {
                traitData.forEach(trait => {
                    if (traitDB[capitalizedCategory]) {
                        const traitInfo = traitDB[capitalizedCategory].find(t => t.trait === trait.name);
                        if (traitInfo) {
                            const base6Value = decimalToBase6(trait.fitnessScore);
                            const formattedOHC = `JXJ${traitInfo.ohcStrand}XJX${base6Value}T`;
                            ohcList.push(formattedOHC);
                        }
                    }
                });
            } else {
                if (traitDB[capitalizedCategory]) {
                    const traitInfo = traitDB[capitalizedCategory].find(t => t.trait === traitData.name);
                    if (traitInfo) {
                        const base6Value = decimalToBase6(traitData.fitnessScore);
                        const formattedOHC = `JXJ${traitInfo.ohcStrand}XJX${base6Value}T`;
                        ohcList.push(formattedOHC);
                    }
                }
            }
        }
    }

    return ohcList.join('');
}

// Export a function to process and save organism data
function encodeOrganismData(organismData, traitDBPath = 'traitDB.json') {
  fs.readFile(traitDBPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the traitsDB.json file:', err);
      return;
    }

    const traitsDB = JSON.parse(data);
    const ohcSequence = processTraits(organismData.traits, traitsDB);

    // Generate a unique OHC filename using a timestamp
    const timestamp = new Date().getTime();
    const ohcFileName = `organism_${timestamp}.ohc`;

    fs.writeFile(ohcFileName, ohcSequence, 'utf8', err => {
      if (err) {
        console.error(`Error writing the ${ohcFileName} file:`, err);
      } else {
        console.log(`Saved ${ohcFileName}`);
      }
    });
  });
}

module.exports = encodeOrganismData;