const env = require('dotenv').config();
const redis = require('redis');
const redisConnect = process.env.REDIS_URL || 'redis://localhost:6379';

const storage = redis.createClient(redisConnect); // TODO need to connect via dyno and not via http
storage.clearStoragePw = process.env.CHAT_DELETE;
storage.on('connect', err => {
  if (err) console.log(`Error connecting to storage`, err);
  else console.log(`Successfully connected to storage`);
});

// ------------------- Interfaces -------------------
// --------------------------------------------------

interface Location {
  x: number;
  y: number;
}

// -------------------- Message ---------------------
// --------------------------------------------------

class Message {
  msgId: number;
  userId: string;
  timeStamp: number;
  text: string;

  constructor(userId: string, text: string) {
    this.msgId = Math.random() * 10000000000000000;
    this.userId = userId;
    this.timeStamp = new Date().getTime();
    this.text = text;
  }

}

// --------------------- Chat -----------------------
// --------------------------------------------------

export class Chat {
}

// ------------------- Character --------------------
// --------------------------------------------------

class Character {
  charId: number;
  charName: string;
  charLocation: Location;
  charHealth: number;

  constructor(charId: number = 1, charName: string = 'Jimmy', charLocation: Location, charHealth: number = 100) {
    this.charId = charId;
    this.charName = charName;
    this.charLocation = charLocation;
    this.charHealth = charHealth;
  }

  charMove(location: Location) {
  }
}

// --------------------- Player ---------------------
// --------------------------------------------------

class Player {
  playerId: string;
  playerName: string;

  constructor(playerName: string = 'Anonymous') {
    // this.playerId = playerId; // TODO implement player id stuff
    this.playerName = playerName;
  }

}

// --------------------- Turn -----------------------
// --------------------------------------------------

class Turn {
  turnId: string;
  turnType: string;
  turnPhrases: any; // TODO learn how to do this correctly
  turnResponses: string[];
  
  constructor(turnId: string, turnType: string) {
    this.turnId = turnId;
    this.turnType = turnType;
    this.turnPhrases = phrases[this.turnType] as any;
  }
  
  turnEmitPromptToClients() {
    // send out prompt details to client
  }
  
  turnStoreVotes(vote: string) {
    storage.lpush(this.turnId, vote);
  }
  
  turnFetchResponses() {
    storage.lrange(this.turnId, 0, -1, (err, data) => {
      if (err) console.log(`Error retrieving ${this.turnId} responses from storage`, err);
      else this.turnResponses = data;
    });
  }

  turnTallyVotes() {
    // count up responses using phrases
  }
  
  // formulate move / course of action
  turnSave() {
    // save move in state by prompt id
    // storage.lpush('moves', {}, err => {
    // });
  }
  
  // push move to headless board if necessary
  // broadcast outcome to clients
  
  turnDelResponses() {
    storage.del(this.turnId, err => {
      if (err) console.log(`Error deleting responses for ${this.turnId}`)
    });
  }

}

// --------------------- Game -----------------------
// --------------------------------------------------

const phrases = require('./phrases.js');

export class Game {
  // going to need to set up persistent storage for this one; or maybe modal?
  gameCharacter: Character;
  gamePlayers: Player[];
  gameTurnActive: boolean;
  gameTurnNum: number;
  gameTurnId: string;
  gameTurnTypes: string[];
  gameTurnInstance: Turn;
  
  constructor() {
    this.gameCharacter = new Character(null, null, {x:0, y:0} as Location, null); // init properly later on
    this.gameTurnActive = false;
    this.gameTurnNum = 0;
    this.gameTurnId = 'turn0';
    this.gameTurnTypes = Object.keys(phrases);
    // storage.lpush('messages', 'WELCOME TO BUILDER GAME. STARTING A NEW GAME, HOW EXCITING!');
  }

  gameAddNewPlayer(playerName: string) {
    const player = new Player()
    this.gamePlayers.push(player); // TODO push to data store, maybe
  }

  gameStoreVote(userId: string = '001', vote: string) {
    if (this.gameTurnActive) this.gameTurnInstance.turnStoreVotes(vote);
  }

  gameNewTurn() {
    // generate new turn number
    this.gameTurnNum++;
    this.gameTurnId = `turn${this.gameTurnNum}`;
    this.gameTurnActive = true;
    // choose a random turn type from the available prompts; can manually control this later when we have an actual game flow designed
    const turnType = this.gameTurnTypes[Math.floor(Math.random() + this.gameTurnTypes.length)];
    // create a new turn instance and let the fun begin
    this.gameTurnInstance = new Turn(this.gameTurnId, turnType);
    // after some period of time:
      // this.gameTurnActive = false;
      // this.gameTurnInstance.turnTallyVotes();
      // storage.lpush('actions', ???);
  }
  
  gameTurnSpacing() {
    // at some interval, after the last turn completes or after the game starts, initiate a new turn
    setInterval(this.gameNewTurn, 45000);
  }
  
}