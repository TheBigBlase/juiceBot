import tmi from 'tmi.js';
import settings from './settings.json';
import chalk from 'chalk';
import {promisify} from 'util';
const readdir = promisify(require('fs').readdir);
import {connectToDatabase} from './src/mongoUtils';
import {say} from './src/sendMessage';
import * as index from './src/commands/index';

import Enmap from 'enmap';
// Define configuration options
const opts = {
  identity: {
    username: settings.nickname,
    password: settings.oauth
  },
  channels: settings.channels
};

// Create a client with our options
let client = new tmi.client(opts);
let commands = new Enmap();

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

//connect to mongo
connectToDatabase();
//conect to twitch 
client.connect()

// Called every time a message comes in
async function onMessageHandler (channel:string, context:any, msg:string) {

	if(context.username === "epicjuicebot") return;

	msg = msg.toLowerCase();
	let args:string[] = msg.slice(settings.prefix.length).trim().split(/ +/g);
	const calledCommand:string|undefined = args.shift();

	if (!msg.startsWith(settings.prefix)) return;
	if(calledCommand == undefined) return console.log('Called command is undefined');

	if(!commands.get(calledCommand)) return;

	commands.get(calledCommand).default(channel, context, args, client);
}



// Called every time the bot connects to Twitch chat
async function onConnectedHandler () {
  console.log(chalk.cyan(`[CONNECTION] Connected to channel ${settings.channels}`));
	for(let commandFile in index){
		if(commandFile in index){
			commands.set(commandFile, (index as any)[commandFile]);
		}
		console.log(chalk.blue(`Attempting to load ${commandFile}`));
	}
	console.log(chalk.green("Loaded all commands"));
	await say("big_blase", "I'm online PagMan", client);
}
