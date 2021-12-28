import tmi from 'tmi.js';
import settings from '../../settings.json';
import * as ops from '../operations';
import {say} from '../sendMessage';

async function main(qqt:string, channel:string, context:any, client:tmi.Client){

	let qqtNumber:number;
	let userId = Number(context['user-id']);
	let juice:number = await ops.getJuice(userId);

	if(qqt ==="all") qqtNumber = juice; // if "all" gamble all 
	

	if(juice == undefined || juice == NaN){
		await ops.add(userId, 5, juice);
		return say(channel, `@${context.username} As this is your first time gambling, you got awarded 5 liters of juice ! PagMan`, client);
	}

	if(qqt.endsWith("%")) qqtNumber = juice * Number(qqt.slice(0,-1))/100;
	else qqtNumber = Number(qqt);

	if(qqt == undefined || qqt == 'NaN' || qqtNumber < 0){
		return say(channel, `@${context.username} Bruh input a valid number you dingus`, client);
	}

	if(juice <= 0){
		await ops.set(userId, 5);
		return say(channel, `@${context.username} You had negative juice, here's 5 liters to gamble`, client);
	}

	if(juice < qqtNumber){
		return say(channel, `@${context.username} You don't have enough juice !`, client);
	}

	let roulette:number = Math.random();

	if(roulette > settings.threshold && roulette < settings.thresholdCrit){ //win
		await ops.add(userId, qqtNumber*.5, juice);
		return say(channel, `@${context.username} You won ! you now have ${juice + qqtNumber*.5} liters of juice ! PagMan`, client);
	}

	else if(roulette > settings.thresholdCrit){ //win
		await ops.add(userId, qqtNumber*2, juice);
		return say(channel, `@${context.username} You won ! you now have ${juice + qqtNumber*2} liters of juice ! PagMan`, client);
	}

	//loss
	ops.rm(userId, qqtNumber, juice);
	return say(channel, `@${context.username} You lost... You've got ${juice - qqtNumber} juices left FeelsBadMan`, client);
};

exports.run = async (channel:string, context:any, args:string[] , uptime:number, client:tmi.Client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args[0], channel, context, client);

	} 
	catch (e) {
		console.log(channel);
		console.error(e);
	}
}
