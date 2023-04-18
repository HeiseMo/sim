// main.js
const encodeOrganismData = require('./encoder.js');
const decodeOHCFile = require('./decoder.js');

const organismData = {
    traits: {
        locomotion: {
            name: "Swimming",
            fitnessScore: 80
        },
        respiration: {
            name: "Gills",
            fitnessScore: 85
        },
        nutrition: {
            name: "Filter feeder",
            fitnessScore: 75
        },
        reproduction: {
            name: "Oviparous (egg-laying)",
            fitnessScore: 65
        },
        sensory: [
            {
                name: "Electroreception",
                fitnessScore: 70
            },
            {
                name: "Vision",
                fitnessScore: 60
            }
        ],
        defense: [
            {
                name: "Toxins (venom, poison)",
                fitnessScore: 80
            },
            {
                name: "Camouflage (cryptic coloration)",
                fitnessScore: 90
            }
        ],
        thermoregulation: {
            name: "Ectothermy (cold-blooded)",
            fitnessScore: 50
        },
        growthAndDevelopment: {
            name: "Metamorphosis (distinct developmental stages)",
            fitnessScore: 70
        },
        immuneSystem: {
            name: "Innate immunity (non-specific defense mechanisms)",
            fitnessScore: 60
        },
        neuralSystem: {
            name: "Centralized nerve cord",
            fitnessScore: 70
        },
        digestion: {
            name: "Complete digestive system (mouth to anus)",
            fitnessScore: 80
        },
        structuralSupport: [
            {
                name: "Hydrostatic skeleton (fluid pressure)",
                fitnessScore: 60
            },
            {
                name: "Exoskeleton (chitin, calcium carbonate)",
                fitnessScore: 75
            }
        ],
        pigmentation: {
            name: "Chromatophores (color-changing cells)",
            fitnessScore: 85
        },
        communication: {
            name: "Acoustic signals (calls, songs)",
            fitnessScore: 60
        },
        socialBehavior: {
            name: "Group living (stable groups)",
            fitnessScore: 70
        },
        matingBehavior: {
            name: "Polygyny (one male, multiple females)",
            fitnessScore: 65
        },
        parentalCare: {
            name: "No parental care",
            fitnessScore: 40
        },
        migration: {
            name: "Latitudinal migration (seasonal movement towards the poles or equator)",
            fitnessScore: 60
        },
        metabolism: {
            name: "Aerobic respiration",
            fitnessScore: 90
        },
        energyStorage: {
            name: "Fat storage",
            fitnessScore: 70
        },
        agingAndLifespan: {
            name: "Intermediate lifespan",
            fitnessScore: 60
        },
        regeneration: {
            name: "Limited regeneration (wound healing)",
            fitnessScore: 50
        },
        symbiosis: {
            name: "Mutualism",
            fitnessScore: 75
        },
        stressResponse: {
            name: "Heat-shock proteins",
            fitnessScore: 55
        },
        diapause: {
            name: "None",
            fitnessScore: 40
        }
    }
}

// ... (more organisms)

// Encode and save organism data
encodeOrganismData(organismData);
//encodeOrganismData(organism2);
// ... (call the function for more organisms)
const ohcFilePath = 'organism_1681860735698.ohc';
decodeOHCFile(ohcFilePath);
