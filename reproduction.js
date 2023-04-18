const fs = require('fs');
const traitDB = require('./traitDB.json');
const organismData = require('./decodedOHC.json');

function reproduce(parent1, parent2) {
  if (isCompatible(parent1, parent2)) {
    const offspring = mergeOHCs(parent1, parent2);
    mutateOffspring(offspring);
    return offspring;
  } else {
    return null;
  }
}

function isCompatible(parent1, parent2) {
    // Implement your similarity check between parents here
    // Example: comparing the first OHC strand for simplicity
    const similarityThreshold = 80; // Set a threshold for similarity
    const parent1Strand = parent1.traits.primary[0].ohcStrand;
    const parent2Strand = parent2.traits.primary[0].ohcStrand;
  
    const similarity = calculateSimilarity(parent1Strand, parent2Strand);
  
    return similarity >= similarityThreshold;
  }
  
  function calculateSimilarity(str1, str2) {
    const minLength = Math.min(str1.length, str2.length);
    let matches = 0;
  
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        matches++;
      }
    }
  
    return (matches / minLength) * 100;
  }
  
  function mergeOHCs(parent1, parent2) {
    const offspring = JSON.parse(JSON.stringify(parent1));
    
    // Implement the merging process between parent1 and parent2 OHCs
    // Example: averaging the fitness scores of each trait for simplicity
    for (const category in offspring.traits) {
      offspring.traits[category] = offspring.traits[category].map((trait, index) => {
        const parent1Score = trait.fitnessScore;
        const parent2Score = parent2.traits[category][index].fitnessScore;
  
        trait.fitnessScore = (parent1Score + parent2Score) / 2;
  
        return trait;
      });
    }
  
    return offspring;
  }
  
  function mutateOffspring(offspring) {
    // Implement mutation rules based on EP and duplication/deletion probabilities
    // Example: add a random value to the fitness score of each trait for simplicity
    const mutationRate = 0.1;
  
    for (const category in offspring.traits) {
      offspring.traits[category] = offspring.traits[category].map((trait) => {
        if (Math.random() < mutationRate) {
          const mutationValue = Math.random() * 2 - 1; // Random value between -1 and 1
          trait.fitnessScore += mutationValue;
          trait.fitnessScore = Math.max(0, trait.fitnessScore); // Ensure the fitness score remains non-negative
        }
  
        return trait;
      });
    }
  }

function reproducePopulation(population) {
  const newPopulation = [];
  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      const offspring = reproduce(population[i], population[j]);
      if (offspring) {
        newPopulation.push(offspring);
      }
    }
  }
  return newPopulation;
}

fs.readFile('population.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the population.json file:', err);
    return;
  }

  const population = JSON.parse(data);
  const newPopulation = reproducePopulation(population);

  fs.writeFile('newPopulation.json', JSON.stringify(newPopulation, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing the newPopulation.json file:', err);
    } else {
      console.log('New population generated in newPopulation.json.');
    }
  });
});