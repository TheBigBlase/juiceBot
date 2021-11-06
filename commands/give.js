const settings = require('../settings');
const https = require('http');
const ops = require('../res/operations');


let callback = function(response) {
	let obj;
	let res = "";
  response.on('data', function (chunk) {
    res += chunk;
		console.log(res);
  });

  response.on('end', function () {
		obj=JSON.parse(res);
		resolve(obj);
		console.log(obj);
  });
}

async function usernameToId(username){
	let options = {
		host: 'api.twitch.tv',
		path: `/helix/users?login=${username}`,
		port: 80,
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${settings.token}`,
			'Client-Id': `${settings.clientID}`
		}
	};
	let req = https.request(options, callback);
	req.end();
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
		return client.say(cahnnel, `@${context.username} Those aren't valid values`);
	}

	let recieverId = usernameToId(reciever);
	console.log(recieverId);

	let userId = Number(context['user-id']);
	let juice = await ops.getJuice(userId);

	if(qqt ==="all") qqt = juice; // if "all" gamble all 

	if(!qqt || qqt <= 0){
		return client.say(channel, `@${context.username} bruh input a valid number you dingus`);
	}
	if(juice == undefined){
		await ops.add(userId, 5, juice);
		return client.say(channel, `@${context.username} As this is your first time gambling, you got awarded 5 litters of juice ! PagMan`);
	}
	if(juice <= 0){
		await ops.set(userId, 5);
		return client.say(channel, `@${context.username} You had negative juice, here's 5 litters to gamble`);
	}
	if(juice < qqt){
		return client.say(channel, `@${context.username} you don't have enough juice !`);
	}
	ops.give(userId, recieverId, qqt, juice); //gib 
	return client.say(channel, `@${context.username} gave ${qqt} juice litters to @${reciever} PogU`);
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
