import tmi from 'tmi.js';
import {usernameToId, give, getJuice} from '../operations';
import {say} from '../sendMessage';



async function main(args:string[], channel:any, context:any, client:tmi.Client){

	let qqt:number;
	let reciever:string;

	if(args[0].startsWith("@") && Number(args[1]) > 0){
		qqt = Number(args[1]);
		reciever = args[0].slice(1);
	}

	else if(args[1].startsWith("@") && Number(args[0]) > 0 ){
		qqt = Number(args[0]);
		reciever = args[1].slice(1);
	}

	else {
		return say(channel, `@${context.username} Those aren't valid values`, client);
	}

	let recieverId:number = await usernameToId(reciever);
	if(recieverId == -1) 
		return say(channel, "Error in top, dev is already working on it", client);

	let userId = Number(context['user-id']);
	let juiceReciever = await getJuice(recieverId);
	let juiceGiver = await getJuice(userId);


	if(!qqt || qqt <= 0){
		return say(channel, `@${context.username} bruh input a valid number you dingus`, client);
	}
	else if(args[0] === 'all' || args[1] === 'all') qqt = juiceGiver; // if "all" gamble all 

	if(juiceGiver < qqt){
		return say(channel, `@${context.username} you don't have enough juice !`, client);
	}

	give(userId, recieverId, qqt, juiceReciever, juiceGiver); //gib 
	return say(channel, `@${context.username} gave ${qqt} juiceReciever liters to @${reciever} PogU`, client);
};

exports.run = async (channel:string, context:any, args:string[], client:tmi.Client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args, channel, context, client);
	} 
	catch (e) {
		console.error(e);
	}
};
