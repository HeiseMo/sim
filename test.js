const fs = require('fs');

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

fs.readFile('traitDB.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the traitsDB.json file:', err);
        return;
    }

    const traitsDB = JSON.parse(data);
    const ohcSequence = processTraits(organismData.traits, traitsDB);

    fs.writeFile('ohcObject.ohc', ohcSequence, 'utf8', err => {
        if (err) {
            console.error('Error writing the ohcObject.ohc file:', err);
        } else {
            console.log('Saved ohcObject.txt');
        }
    });
});