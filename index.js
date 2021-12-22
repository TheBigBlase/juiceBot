const tmi = require('tmi.js');
const {performance} = require('perf_hooks');
const settings = require('./settings.json');
const chalk = require('chalk');
const {promisify, addListener} = require('util');
const readdir = promisify(require('fs').readdir);
const {connectToServer} = require('./res/mongoUtils');
const say = require('./res/sendMessage');

const Enmap = require('enmap');
// Define configuration options
const opts = {
  identity: {
    username: settings.nickname,
    password: settings.oauth
  },
  channels: settings.channels
};

let uptime;
// Create a client with our options
const client = new tmi.client(opts);
client.commands = new Enmap();

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);


//connect to mongo
connectToServer( function( err, mongoClient ) {
  if (err) console.log(err);
	// then connect to twitch
	client.connect();
	uptime = performance.now()
} );

// Called every time a message comes in
async function onMessageHandler (target, context, msg, self) {

	if(context.username === "epicjuicebot") return;

	msg = msg.toLowerCase();
	args = msg.slice(settings.prefix.length).trim().split(/ +/g);
	const calledCommand = args.shift();

	if (!msg.startsWith(settings.prefix)) return;
	if(!client.commands.get(calledCommand)) return;

	client.commands.get(calledCommand).run(target, context, msg, self, args, uptime, client);
}



// Called every time the bot connects to Twitch chat
async function onConnectedHandler (addr, port) {
  console.log(chalk.cyan(`[CONNECTION] Connected to channel ${settings.channels}`));
	try{
		const command =  await readdir('./commands');
		command.forEach(file=>{
			if(!file.endsWith(".js")) return;
			let props = require(`./commands/${file}`);
			let commandName = file.split(".")[0];
			client.commands.set(commandName, props);
			console.log(chalk.blue(`Attempting to load ${commandName}`));
		});
		console.log(chalk.green("Loaded all commands"));
		await say("big_blase", "I'm online PagMan", client);
		}
		catch(err){
				console.log(chalk.bgRed("error in init : ",err));
		}

}
