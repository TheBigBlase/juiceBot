import tmi from 'tmi.js';
import settings from '../../settings.json';
import axios from "axios";
import * as ops from '../operations';
import {say} from '../sendMessage';


async function idToUsername(id:number){
	let options = {
		headers: {
			'Authorization': `Bearer ${settings.token}`,
			'Client-Id': `${settings.clientID}`
		}
	};
	if(id == undefined) return "nobody";

	return await axios.get(`https://api.twitch.tv/helix/users?id=${id}`, options)
										.then((res) => {return res.data.data[0].display_name})
										.catch((err) => console.log(err));
}


async function main(channel:string, client:tmi.Client){
	let top = await ops.getTop(5);
	if(top == undefined) return;

	let fill = 5 - top.length;

	for(let k = 0; k < fill; k++){
		top.push({_id:undefined, bank:0});
	}
	
console.log(`1st : ${await idToUsername(top[0]._id)} with ${top[0].bank} juice, \
						2nd : ${await idToUsername(top[1]._id)} with ${top[1].bank} juice, \
						3rd : ${await idToUsername(top[2]._id)} with ${top[2].bank} juice, \
						4th : ${await idToUsername(top[3]._id)} with ${top[4].bank} juice, \
						5th : ${await idToUsername(top[4]._id)} with ${top[4].bank} juice`);

	await say(channel, `1st : ${await idToUsername(top[0]._id)} with ${top[0].bank} juice, \
						2nd : ${await idToUsername(top[1]._id)} with ${top[1].bank} juice, \
						3rd : ${await idToUsername(top[2]._id)} with ${top[2].bank} juice, \
						4th : ${await idToUsername(top[3]._id)} with ${top[4].bank} juice, \
						5th : ${await idToUsername(top[4]._id)} with ${top[4].bank} juice`, client);
};

export default async function top(channel:string, context:any, args:string[], 
										 client:tmi.Client){
	try {
			// Connect to the MongoDB cluster
		await main(channel, client);
	} 
	catch (e) {
		console.error(e);
	}
};
