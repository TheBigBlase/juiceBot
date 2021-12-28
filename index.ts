import tmi from 'tmi.js';
import {performance} from 'perf_hooks';
import settings from './settings.json';
import chalk from 'chalk';
import {promisify} from 'util';
const readdir = promisify(require('fs').readdir);
import {connectToServer} from './res/mongoUtils';
import {say} from './res/sendMessage';

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
const client = new tmi.client(opts);
let commands = new Enmap();

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

//connect to mongo
connectToServer( function( err:Error) {
  if (err) console.error(err);
	// then connect to twitch
	client.connect();
} );

// Called every time a message comes in
async function onMessageHandler (channel:string, context:any, msg:string) {

	if(context.username === "epicjuicebot") return;

	msg = msg.toLowerCase();
	let args:string[] = msg.slice(settings.prefix.length).trim().split(/ +/g);
	const calledCommand:string|undefined = args.shift();

	if (!msg.startsWith(settings.prefix)) return;
	if(calledCommand == undefined) return console.log('Called command is undefined');
	if(!commands.get(calledCommand)) return;

	commands.get(calledCommand).run(channel, context, args, client);
}



// Called every time the bot connects to Twitch chat
async function onConnectedHandler () {
  console.log(chalk.cyan(`[CONNECTION] Connected to channel ${settings.channels}`));
		const command =  await readdir('./build/commands');
		command.forEach((file:any)=>{
			if(!file.endsWith(".js")) return;
			let props = require(`./src/commands/${file}`);
			let commandName = file.split(".")[0];
			commands.set(commandName, props);
			console.log(chalk.blue(`Attempting to load ${commandName}`));
		});
		console.log(chalk.green("Loaded all commands"));
		await client.say("big_blase", "I'm online PagMan");

}
