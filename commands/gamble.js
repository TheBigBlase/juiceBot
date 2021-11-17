const settings = require('../settings');
const ops = require('../res/operations');

async function main(qqt, channel, context, client){

	let userId = Number(context['user-id']);
	let juice = await ops.getJuice(userId);

	if(qqt ==="all") qqt = juice; // if "all" gamble all 
	

	if(qqt.endsWith("!")) qqt = juice * Number(qqt.slice(0,-1))/100
	qqt = Number(qqt);


	if(juice == undefined || juice == NaN){
		await ops.add(userId, 5, juice);
		return client.say(channel, `@${context.username} As this is your first time gambling, you got awarded 5 liters of juice ! PagMan`);
	}

	if(qqt == undefined || qqt == NaN || qqt < 0){
		return client.say(channel, `@${context.username} Bruh input a valid number you dingus`);
	}

	if(juice <= 0){
		await ops.set(userId, 5);
		return client.say(channel, `@${context.username} You had negative juice, here's 5 liters to gamble`);
	}

	if(juice < qqt){
		return client.say(channel, `@${context.username} You don't have enough juice !`);
	}

	if(Math.random() > settings.threshold){ //win
		await ops.add(userId, qqt, juice);
		return client.say(channel, `@${context.username} You won ! you now have ${juice + qqt} liters of juice ! PagMan`);
	}

	//loss
	ops.rm(userId, qqt, juice);
	return client.say(channel, `@${context.username} You lost... You've got ${juice - qqt} juices left FeelsBadMan`);
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
