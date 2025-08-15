let xp =0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

//to access the html tags
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

const weapons =[
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

const monsters =[
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
]

const gamelocation = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button function": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see the sign that says \"store\"."
    },
    {
        name: "store",
        "button text": [ "Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button function": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },    
     {
        name: "cave",
        "button text": ["Fight slimes","Fight fanged beast", "Go to town square"],
        "button function": [fightSlime, fightBeast, goTown],
        text: "You enter the cave."
     },
     {
        name : "fight",
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
        text : "YOU DIE."
     },
     {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button function": [restart, restart, restart],
        text : "You defeated the dragon, You win the GAME!"
     },
     {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square"],
        "button function": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 1 and 10. If the number you choose matches one of the aboe random numbers, YOU WIN!"
     }
]; //when the function is repeating just create a empty array with name location where u store
//const arr = [ {name: "AKI"} ];


//initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(gamelocation) {
    button1.innerText = gamelocation["button text"][0];
    button2.innerText = gamelocation["button text"][1];
    button3.innerText = gamelocation["button text"][2];    

    button1.onclick = gamelocation["button function"][0];
    button2.onclick = gamelocation["button function"][1];
    button3.onclick = gamelocation["button function"][2]; 
    text.innerText = gamelocation.text; //or location[text]
    monsterStats.style.display = "none";//when go to new loctaion the monster stat will no longer show up

}


function goStore() {
    update(gamelocation[1]);

//    button1.innerText = "Buy 10 health (10 gold)";
//    button2.innerText = "Buy weapon (30 gold)";
//    button3.innerText = "Go to town square";
//    button1.onclick = buyHealth;
//    button2.onclick = buyWeapon;
//    button3.onclick = goTown;
//    text.innerText = "You enter the store.";
      // Add this line
//    console.log("The text variable is:", text); 
    
//    text.innerText = "You enter the store.";
}

function goTown() {
    update(gamelocation[0]); //[0] is done to pass in first element in an array

//    button1.innerText = "Go to store";
//  button2.innerText = "Go to cave";
//button3.innerText = "Fight dragon";    

//    button1.onclick = goStore;
//   button2.onclick = goCave;
//    button3.onclick = fightDragon; 
//    text.innerText = "You are in the town square. You see the sign that says \"store\".";
}

function goCave() {
    update (gamelocation[2]);
}



function buyHealth() {
    
    if (gold>=10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else{
        text.innerText = "Not enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1){
        if (gold >=30){
            gold -=30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;

            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon); //adding new weapon to inventory.
            text.innerText += " \n In your inventory, you have: "+ inventory; 
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapone lad"
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }

}

function sellWeapon() {
    if (inventory.length >1){
        gold +=15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift(); //selling the previous weapon
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += "In your inventory, you have: "+inventory;
    } else {
        text.innerText = "Don't sell your only weapon warrior!";
    }
}

function fightSlime() {
    fighting =0;
    goFight();

}

function fightBeast() {
    fighting = 1;
    goFight();

}

function fightDragon() {
    //console.log("Fighting Dragon.")
    fighting =2;
    goFight();
}

function goFight() {
    update(gamelocation[3]);
    monsterHealth = monsters[fighting].health;
    //display the moster style that is none displayed in css 
    monsterStats.style.display = "block"; //update css style in js
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth

}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += "\n You attack it with your "+ weapons[currentWeapon].name + ".";
    if (isMonsterHit()){
        health -= geMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += " You miss";
    }
    
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp)+ 1; //roundoff to nearest whole no +1
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <=0){
        lose();
    } else if (monsterHealth<=0){
        // fighting == 2 ? winGame() : defeatMonster();
        if (fighting == 2 ){
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1){ //10% chance of weapon break
            text.innerText += " Your " + inventory.pop() + " breaks.";
            currentWeapon--;
    }
}

function isMonsterHit() {
    return Math.random > .2 || health < 20; //return true hit when hp leass than 20 and 20% of time its going to be a miss and 80% time its a hit

}

function geMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function dodge () {
    text.innerText = "You dodge the attack from the "+ monsters[fighting].name + ".";

}

function run() {

}

function lose(){
    update(gamelocation[5]);
}

function winGame(){
    update(gamelocation[6]);
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level *6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(gamelocation[4]);

}

function restart() {
xp =0;
health = 100;
gold = 50;
currentWeapon = 0;
inventory = ["stick"];
goldText.innerText = gold;
healthText.innerText = health;
xpText.innerText = xp;
goTown();

}

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
        numbers.push(Math.floor(Math.random() * 11))
    }

    text.innerText = "You picked "+ guess + ". Here are the random numbers:\n";

    for (let i =0; i<10; i++){
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.indexOf(guess) !== -1){
        text.innerText += "Right! You win 20 gold!";
        gold+= 20;
        goldText.innerText = gold;

    } else {
        text.innerText += "WRONG! You lose 10 health!";
        health -= 20;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }


}