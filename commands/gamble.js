const settings = require('../settings');
const ops = require('../res/operations');



async function main(qqt, channel, context, client){
	let userId = context['user-id'];
	if(ops.getJuice(userId) < qqt){
		return client.say(channel, "@${context.username} you don't have enough juice !");
	}
	if(Math.random() > settings.threshold){ //win
		await ops.add(userId, qqt);
		return client.say(channel, "@${context.username} PogU you won ! you know have ${ops.getJuice(userId)}");
	}
	//loss
	ops.rm(userId, qqt);
	return client.say(channel, "@${context.username} FeelsBadMan you lost... You've got ${ops.getJuice(userId)} juices left");
};

exports.run = async (channel, context, msg, self, args, uptime, client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args[0], channel, context, client);

	} 
	catch (e) {
		console.log(channel);
		console.error(e);
	}
}
