const fs = require('fs');
const traitDB = require('./traitDB.json');

fs.readFile('ohcObject.ohc', 'utf-8', (err, encodedString) => {
  if (err) {
    console.error('Error reading the ohcObject.ohc file:', err);
    return;
  }

  // Separate the strands using the provided logic
  const strands = [];
  const ohcPattern = /JXJ((?:[A-G\d]{2})+)(?=XJX(\d+)(T)?([A-G\d]+)?)/g
  let match;

  while ((match = ohcPattern.exec(encodedString)) !== null) {
    const ohcStrand = match[1];
    const fitnessScoreBase6 = match[2];
    const mutableSection = match[3] === 'T' && !match[4] ? 'T' : match[4];

    function similarity(str1, str2) {
      const length1 = str1.length;
      const length2 = str2.length;

      if (length1 === 0 || length2 === 0) {
        return 0;
      }

      let matches = 0;

      for (let i = 0; i < Math.min(length1, length2); i++) {
        if (str1[i] === str2[i]) {
          matches++;
        }
      }

      return (matches / Math.min(length1, length2)) * 100;
    }
    const similarityPercentage = mutableSection ? similarity(ohcStrand, mutableSection) : 0;

    strands.push({
      ohcStrand: ohcStrand,
      fitnessScoreBase6: fitnessScoreBase6,
      mutableSection: mutableSection,
      similarity: similarityPercentage
    });
  }

  function base6ToBase10(base6Number) {
    let base10Number = 0;
    let placeValue = 1;

    for (let i = base6Number.length - 1; i >= 0; i--) {
      base10Number += parseInt(base6Number[i], 6) * placeValue;
      placeValue *= 6;
    }

    return base10Number;
  }

  function addTraitToPathway(pathwayObj, trait) {
    if (!pathwayObj) {
      pathwayObj = [];
    }

    if (Array.isArray(trait)) {
      for (const t of trait) {
        pathwayObj.push({
          name: t.name,
          fitnessScore: t.fitnessScore,
        });
      }
    } else {
      pathwayObj.push({
        name: trait.name,
        fitnessScore: trait.fitnessScore,
      });
    }

    return pathwayObj;
  }

  const organismData = {
    traits: {},
  };
  function findTraitAndFitnessScore(ohcStrand, fitnessScoreBase6) {
    const results = [];
    for (const category in traitDB) {
      for (const traitObj of traitDB[category]) {
        if (traitObj.ohcStrand === ohcStrand) {
          const fitnessScore = base6ToBase10(fitnessScoreBase6);
          results.push({
            category: category,
            traitName: traitObj.trait,
            fitnessScore: fitnessScore,
          });
        }
      }
    }
    return results.length > 0 ? results : null;
  }

  for (const strand of strands) {
    const results = findTraitAndFitnessScore(strand.ohcStrand, strand.fitnessScoreBase6);
    if (results) {
      for (const result of results) {
        const trait = {
          name: result.traitName,
          fitnessScore: result.fitnessScore,
        };
        const category = result.category;
        if (Array.isArray(organismData.traits[category])) {
          organismData.traits[category].push(trait);
        } else if (organismData.traits[category]) {
          organismData.traits[category] = [organismData.traits[category], trait];
        } else {
          organismData.traits[category] = trait;
        }
      }
    }
  }
    
    fs.writeFile('decodedOHC.json', JSON.stringify(organismData, null, 2), (err) => {
    if (err) {
    console.error('Error writing to decodedOHC.json:', err);
    return;
    }
    console.log('Organism data successfully saved to decodedOHC.json');
    });
    });
