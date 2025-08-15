let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Access HTML elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Define game data: weapons, monsters, and game locations
const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

const gamelocation = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button function": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see the sign that says \"store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button function": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },    
    {
        name: "cave",
        "button text": ["Fight slimes", "Fight fanged beast", "Go to town square"],
        "button function": [fightSlime, fightBeast, goTown],
        text: "You enter the cave."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button function": [attack, dodge, run],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button function": [goTown, goTown, easterEgg],
        text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button function": [restart, restart, restart],
        text: "YOU DIE."
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button function": [restart, restart, restart],
        text: "You defeated the dragon, You win the GAME!"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square"],
        "button function": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 1 and 10. If the number you choose matches one of the above random numbers, YOU WIN!"
    }
];

// Initialize buttons with starting location actions
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Function to update the game UI based on location
function update(location) {
    // Hide monster stats unless in a fight location
    if (location.name !== "fight") {
        monsterStats.style.display = "none";
    }

    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];    

    button1.onclick = location["button function"][0];
    button2.onclick = location["button function"][1];
    button3.onclick = location["button function"][2]; 
    text.innerText = location.text;
}

// Functions to navigate between locations
function goStore() {
    update(gamelocation[1]);
}

function goTown() {
    update(gamelocation[0]);
}

function goCave() {
    update(gamelocation[2]);
}

// Shop actions
function buyHealth() {
    if (gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "Not enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1){
        if (gold >= 30){
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;

            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += "\nIn your inventory, you have: " + inventory.join(", ") + "."; // Joined for better display
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon, warrior!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1){ // Ensure player keeps at least one weapon
        gold += 15;
        goldText.innerText = gold;
        let soldWeapon = inventory.shift(); // Sells the first weapon in inventory (usually the oldest)
        text.innerText = "You sold a " + soldWeapon + ".";
        text.innerText += "\nIn your inventory, you have: " + inventory.join(", ") + "."; // Joined for better display
        // If the current weapon was sold, adjust currentWeapon index (simple fix: go back to the basic weapon)
        if (weapons[currentWeapon].name === soldWeapon && currentWeapon > 0) {
            currentWeapon--; // This assumes selling reduces you to the previous weapon power.
        }
    } else {
        text.innerText = "Don't sell your only weapon, warrior!";
    }
}

// Fight initiation functions
function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(gamelocation[3]); // Sets the UI to the fight location
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block"; // Show monster stats when fighting
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

// Combat actions
function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += "\nYou attack it with your " + weapons[currentWeapon].name + ".";
    
    // Player takes damage from monster
    if (isMonsterHit()){
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += " You miss!";
    }
    
    // Monster takes damage from player
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    
    // Check game state after attack
    if (health <= 0){
        lose();
    } else if (monsterHealth <= 0){
        if (fighting === 2){ // If fighting dragon
            winGame();
        } else {
            defeatMonster();
        }
    }

    // 10% chance for weapon to break if player has more than one weapon
    if (Math.random() <= .1 && inventory.length > 1){
            text.innerText += "\nYour " + inventory.pop() + " breaks!";
            currentWeapon = Math.max(0, currentWeapon - 1); // Ensure currentWeapon doesn't go below 0
            // Update the weapon in hand if the broken one was the current one
            text.innerText += "\nYou are now wielding a " + weapons[currentWeapon].name + ".";
    }
}

// Determines if player hits the monster (simplified logic)
function isMonsterHit() {
    // Math.random() needs parentheses to be called as a function
    return Math.random() > .2 || health < 20; 
}

// Calculates monster attack value
function getMonsterAttackValue(level) { // Fixed typo: geMonsterAttackValue -> getMonsterAttackValue
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit); // Useful for debugging
    return Math.max(0, hit); // Ensure damage is not negative
}

function dodge () {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
    // Monsters still attack on player's dodge turn, so player might still take damage
    health -= getMonsterAttackValue(monsters[fighting].level) / 2; // Reduce damage when dodging
    healthText.innerText = health;
    if (health <= 0) {
        lose();
    }
}

function run() {
    text.innerText = "You attempt to run away from the " + monsters[fighting].name + ".";
    // Simple run away logic, always returns to town for now
    goTown(); 
}

// Game end states
function lose(){
    update(gamelocation[5]);
}

function winGame(){
    update(gamelocation[6]);
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(gamelocation[4]); // Go to kill monster screen
}

// Restart game function
function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"]; // Reset inventory to just the stick
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown(); // Return to starting location
}

// Easter Egg functions
function easterEgg() {
    update(gamelocation[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11)); // Numbers between 0 and 10 (inclusive)
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++){
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)){ // Using includes for array checking
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "WRONG! You lose 10 health!";
        health -= 10; // Changed from 20 to 10 for less harsh punishment
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}
