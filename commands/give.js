const ops = require('../res/operations');
const {usernameToId} = require('../res/operations');
const say = require('../res/sendMessage');



async function main(args, channel, context, client){

	let qqt, reciever;

	if(args[0].startsWith("@") && (Number(args[1]) > 0 || args[0]==="all")){
		qqt = Number(args[1]);
		reciever = args[0].slice(1);
	}

	else if(args[1].startsWith("@") && (Number(args[0]) >0 || args[0]==="all")){
		qqt = Number(args[0]);
		reciever = args[1].slice(1);
	}

	else {
		return say(channel, `@${context.username} Those aren't valid values`, client);
	}

	let recieverId = await usernameToId(reciever);

	let userId = Number(context['user-id']);
	let juiceReciever = await ops.getJuice(recieverId);
	let juiceGiver = await ops.getJuice(userId);

	if(qqt ==="all") qqt = juiceGiver; // if "all" gamble all 

	if(!qqt || qqt <= 0){
		return say(channel, `@${context.username} bruh input a valid number you dingus`, client);
	}

	if(juiceGiver < qqt){
		return say(channel, `@${context.username} you don't have enough juice !`, client);
	}

	ops.give(userId, recieverId, qqt, juiceReciever, juiceGiver); //gib 
	return say(channel, `@${context.username} gave ${qqt} juiceReciever liters to @${reciever} PogU`, client);
};

exports.run = async (channel, context, msg, self, args, uptime, client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args, channel, context, client);
	} 
	catch (e) {
		console.error(e);
	}
};
