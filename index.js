// Animal Class
class Animal {
    constructor(options) {
        this.speciesID = options.speciesID;
        this.energy = options.energy;
        this.speed = options.speed;
        this.strength = options.strength;
        this.intelligence = options.intelligence;
        this.instinct = options.instinct;
        this.otherTraits = options.otherTraits; //Phys T, Mental T, Diet
        this.x = options.x;
        this.y = options.y;
      }

      move(terrarium) {
        // Calculate the potential new position based on the animal's speed
        const deltaX = this.speed * (Math.random() * 2 - 1);
        const deltaY = this.speed * (Math.random() * 2 - 1);
      
        // Calculate the new position while keeping the animal within the terrarium's boundaries
        const newX = Math.min(Math.max(this.x + deltaX, 0), terrarium.width);
        const newY = Math.min(Math.max(this.y + deltaY, 0), terrarium.height);
      
        // Update the x and y coordinates
        this.x = newX;
        this.y = newY;
      
        // Calculate the energy used for the movement
        const energyUsed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Decrease the animal's energy based on the distance moved
        this.energy -= energyUsed;
      
        // Log the move action
        console.log(
          `Animal (ID: ${this.speciesID}) moved to (${this.x}, ${this.y}). Energy used: ${energyUsed.toFixed(2)}, Current energy: ${this.energy.toFixed(2)}`
        );
      }

  eat(target) {
    // Check if the target is an instance of Plant or Animal
    if (!(target instanceof Plant || target instanceof Animal)) {
      return;
    }

    // Calculate the energy gained from eating the target
    let energyGained;
    if (target instanceof Plant) {
      energyGained = target.energyProduction;
    } else {
      energyGained = target.energy * 0.5; // Assuming 50% of the target's energy is transferred
    }

    // Increase the animal's energy
    this.energy += energyGained;

    // Reduce the target's energy or remove it from the terrarium if it's a Plant
    if (target instanceof Plant) {
      target.energyProduction -= energyGained;
    } else {
      target.energy -= energyGained;
    }
    console.log(
        `Animal (ID: ${this.speciesID}) ate food with ${foodEnergy} energy. Energy: ${this.energy}`
      );
  }

reproduce(terrarium) {
        // Find a potential partner
        const partner = terrarium.findPotentialPartner(this);
    
        // If no suitable partner is found, return null
        if (!partner) {
          return null;
        }
    // Calculate the offspring traits as an average of the parents' traits
    const offspringEnergy = (this.energy + partner.energy) / 2;
    const offspringSpeed = (this.speed + partner.speed) / 2;
    const offspringStrength = (this.strength + partner.strength) / 2;
    const offspringIntelligence = (this.intelligence + partner.intelligence) / 2;
    const offspringInstinct = (this.instinct + partner.instinct) / 2;

    // Combine otherTraits objects
    const offspringOtherTraits = { ...this.otherTraits, ...partner.otherTraits };

    // Apply mutations to offspring traits
    // You can implement custom mutation logic here, e.g., random changes to traits within a certain range

    // Create a new Animal instance for the offspring
    const offspring = new Animal(
      "Offspring",
      offspringEnergy,
      offspringSpeed,
      offspringStrength,
      offspringIntelligence,
      offspringInstinct,
      this.x,
      this.y,
      this.speciesID,
      offspringOtherTraits
    );
    console.log(
        `Animals (ID: ${this.speciesID} and ID: ${partner.speciesID}) reproduced. Offspring energy: ${offspring.energy}`
      );
    // Return the offspring
    return offspring;
  }

  mutate(mutationRate = 0.1) {
    // Apply mutations to each trait based on the mutation rate
    const applyMutation = (value) => {
      if (Math.random() < mutationRate) {
        // Apply a random mutation within a certain range, e.g., ±10%
        const mutation = 1 + (Math.random() * 0.2 - 0.1);
        return value * mutation;
      }
      return value;
    };

    // Mutate the traits
    this.energy = applyMutation(this.energy);
    this.speed = applyMutation(this.speed);
    this.strength = applyMutation(this.strength);
    this.intelligence = applyMutation(this.intelligence);
    this.instinct = applyMutation(this.instinct);

    // Mutate otherTraits as needed
    for (const key in this.otherTraits) {
      this.otherTraits[key] = applyMutation(this.otherTraits[key]);
    }
  }

  fitness(terrarium) {
    // Calculate the fitness based on the animal's traits and its interactions with the environment
    // This is just a simple example, you can implement a more sophisticated fitness calculation based on your simulation requirements

    // Calculate environmental factors
    const temperatureFactor = 1 - Math.abs(terrarium.temperature - this.otherTraits.optimalTemperature) / 100;
    const precipitationFactor = 1 - Math.abs(terrarium.precipitation - this.otherTraits.optimalPrecipitation) / 100;

    // Calculate trait-based factors
    const speedFactor = this.speed / 10;
    const strengthFactor = this.strength / 10;
    const intelligenceFactor = this.intelligence / 10;
    const instinctFactor = this.instinct / 10;

    // Calculate the overall fitness
    const fitness = temperatureFactor * precipitationFactor * speedFactor * strengthFactor * intelligenceFactor * instinctFactor;

    // Return the fitness
    return fitness;
  }

  evaluateNicheCompatibility(terrarium) {
    // Calculate the compatibility with the environment based on the animal's traits and the terrarium conditions
    const temperatureCompatibility = 1 - Math.abs(terrarium.temperature - this.otherTraits.optimalTemperature) / 100;
    const precipitationCompatibility = 1 - Math.abs(terrarium.precipitation - this.otherTraits.optimalPrecipitation) / 100;

    // Calculate the overall niche compatibility
    const nicheCompatibility = temperatureCompatibility * precipitationCompatibility;

    // Return the niche compatibility
    return nicheCompatibility;
  }

  evaluateInterspeciesInteraction(terrarium) {
    // Implement a function that calculates the effects of interactions between different species (e.g., predation, competition, etc.)

    // Calculate a sample interaction score based on the animal's traits and other species in the terrarium
    let interactionScore = 0;

    for (const otherAnimal of terrarium.animals) {
      if (otherAnimal.speciesID !== this.speciesID) {
        // Calculate the interaction score based on the difference in strength and intelligence
        const strengthDifference = Math.abs(this.strength - otherAnimal.strength);
        const intelligenceDifference = Math.abs(this.intelligence - otherAnimal.intelligence);

        // Calculate the interaction score for this pair of animals (you can use any formula that makes sense for your simulation)
        interactionScore += strengthDifference * intelligenceDifference;
      }
    }

    // Return the interaction score
    return interactionScore;
  }

  shouldSpeciate(terrarium) {
    // Determine if the animal should speciate based on its fitness, niche compatibility, and interaction score
    const fitness = this.fitness(terrarium);
    const nicheCompatibility = this.evaluateNicheCompatibility(terrarium);
    const interactionScore = this.evaluateInterspeciesInteraction(terrarium);

    // Implement a custom condition for speciation (e.g., high fitness, low niche compatibility, and high interaction score)
    const speciationCondition = fitness > 0.8 && nicheCompatibility < 0.5 && interactionScore > 10;

    // Return true if the animal should speciate, false otherwise
    return speciationCondition;
  }

  getDescription() {
    // Generate a description of the animal based on its traits
    const energyDescription = `Energy: ${this.energy.toFixed(1)}`;
    const speedDescription = `Speed: ${this.speed.toFixed(1)}`;
    const strengthDescription = `Strength: ${this.strength.toFixed(1)}`;
    const intelligenceDescription = `Intelligence: ${this.intelligence.toFixed(1)}`;
    const instinctDescription = `Instinct: ${this.instinct.toFixed(1)}`;

    // Generate a description for otherTraits
    const otherTraitsDescriptions = [];
    for (const key in this.otherTraits) {
        if (typeof this.otherTraits[key] === 'number') {
          otherTraitsDescriptions.push(`${key}: ${this.otherTraits[key].toFixed(1)}`);
        } else {
          otherTraitsDescriptions.push(`${key}: ${this.otherTraits[key]}`);
        }
      }

    // Combine all descriptions into a single string
    const description = `Animal (${this.speciesID}): ${energyDescription}, ${speedDescription}, ${strengthDescription}, ${intelligenceDescription}, ${instinctDescription}, ${otherTraitsDescriptions.join(', ')}`;

    // Return the description
    return description;
  }
}

// Plant Class
class Plant {
  constructor(name, energyProduction, x, y, speciesID, otherTraits) {
    // Class properties
  }

  // Class methods
  // ... (other methods from previous answers) ...
}


// Terrarium Class
class Terrarium {
    constructor(width, height, temperature, precipitation) {
      this.width = width;
      this.height = height;
      this.temperature = temperature;
      this.precipitation = precipitation;
      this.animals = [];
      this.plants = [];
    }
  
    addAnimal(animal) {
      this.animals.push(animal);
    }
    findPotentialPartner(animal) {
        // Define a search radius for potential partners
        const searchRadius = 5; // Adjust this value according to your requirements
      
        // Filter the list of animals to find potential partners
        const potentialPartners = this.animals.filter((otherAnimal) => {
          // Check if the other animal is within the search radius
          const distance = Math.sqrt(
            Math.pow(animal.x - otherAnimal.x, 2) + Math.pow(animal.y - otherAnimal.y, 2)
          );
      
          // Return true if the other animal is within the search radius, has the same species ID, and is not the same animal
          return (
            distance <= searchRadius &&
            animal.speciesID === otherAnimal.speciesID &&
            animal !== otherAnimal
          );
        });
      
        // Return a random potential partner if any are found
        if (potentialPartners.length > 0) {
          return potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
        }
      
        // Return null if no potential partners are found
        return null;
      }
  /*
    addPlant(plant) {
      this.plants.push(plant);
    }*/
  
    update() {
      // Update each animal's state (move, eat, reproduce, mutate, etc.)
      for (const animal of this.animals) {
        animal.move(this);
        animal.eat(this);
        animal.mutate();
      }

      //Update Animal Reproduction
      const newOffspring = [];
      for (const animal of this.animals) {
        // Check if the animal can reproduce (you can use your own reproduction condition here)
        if (animal.energy > 50) {
          const offspring = animal.reproduce(this);
          if (offspring) {
            newOffspring.push(offspring);
          }
        }
      }
    
      // Add the offspring to the terrarium
      this.animals.push(...newOffspring);
  /*
      // Update each plant's state (grow, reproduce, mutate, etc.)
      for (const plant of this.plants) {
        plant.grow(this);
        plant.reproduce(this);
        plant.mutate();
      }
  */
      // Remove dead animals and plants
      this.animals = this.animals.filter(animal => animal.energy > 0);
      //this.plants = this.plants.filter(plant => plant.energy > 0);
    }
  
    // ... (other methods as needed) ...
  }
  // Define initial values for the terrarium
const initialWidth = 100;
const initialHeight = 100;
const initialTemperature = 20; // In Celsius
const initialPrecipitation = 50; // In mm/month or any other unit you prefer

// Create an instance of the Terrarium class using the initial values
terrarium = new Terrarium(initialWidth, initialHeight, initialTemperature, initialPrecipitation);
protoAnimal = new Animal({
    speciesID: 1,
    energy: 100,
    speed: 1,
    strength: 1,
    intelligence: 1,
    instinct: 1,
    otherTraits: {
      sociability: 0.5,
      landLocomotion: 0.5,
      waterLocomotion: 0.5,
      flyingLocomotion: 0,
      habitatPreference: 'mixed', // land, water, or mixed
    },
    x: Math.floor(Math.random() * terrarium.width),
    y: Math.floor(Math.random() * terrarium.height),
  });

// Main simulation function
function runSimulation(terrarium, protoAnimal, iterations) {
    // Add the initial animals and plants to the terrarium
    terrarium.addAnimal(protoAnimal);
    //terrarium.addPlant(protoPlant);
    // Print initial state
    console.log('Initial state:');
    for (const animal of terrarium.animals) {
      console.log(animal.getDescription());
    }/*
    for (const plant of terrarium.plants) {
      console.log(plant.getDescription());
    }*/
  // Create the proto-animal and proto-plant instances

    //const protoPlant = new Plant(/* ... */);
    // Run the simulation for the specified number of iterations
    for (let i = 0; i < iterations; i++) {
      console.log(`\nIteration ${i + 1}:`);
      
      // Update terrarium state (animals and plants)
      terrarium.update();
  
      // Print the current state of the terrarium
      for (const animal of terrarium.animals) {
        console.log(animal.getDescription());
      }/*
      for (const plant of terrarium.plants) {
        console.log(plant.getDescription());
      }*/
    }
  }

// Function to determine if the simulation should end
function simulationShouldEnd() {
  // Implement a function that checks if the simulation should end.
  // This could be based on factors such as elapsed time, number of generations, or other criteria.
}

// Run the simulation
const iterations = 100;
runSimulation(terrarium, protoAnimal, iterations);
