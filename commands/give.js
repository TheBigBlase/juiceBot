const settings = require('../settings');
const axios = require("axios");
const ops = require('../res/operations');


async function usernameToId(username){
	let options = {
		headers: {
			'Authorization': `Bearer ${settings.token}`,
			'Client-Id': `${settings.clientID}`
		}
	};
		return await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, options)
								.then((res) => {return Number(res.data.data[0].id)})
								.catch((err) => console.log(err));
}


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
		return client.say(channel, `@${context.username} Those aren't valid values`);
	}

	let recieverId = await usernameToId(reciever);

	let userId = Number(context['user-id']);
	let juiceReciever = await ops.getJuice(recieverId);
	let juiceGiver = await ops.getJuice(userId);

	if(qqt ==="all") qqt = juiceGiver; // if "all" gamble all 

	if(!qqt || qqt <= 0){
		return client.say(channel, `@${context.username} bruh input a valid number you dingus`);
	}

	if(juiceGiver < qqt){
		return client.say(channel, `@${context.username} you don't have enough juice !`);
	}

	ops.give(userId, recieverId, qqt, juiceReciever, juiceGiver); //gib 
	return client.say(channel, `@${context.username} gave ${qqt} juiceReciever litters to @${reciever} PogU`);
};

exports.run = async (channel, context, msg, self, args, uptime, client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args, channel, context, client);
	} 
	catch (e) {
		console.log(channel);
		console.error(e);
	}
};
