import tmi from 'tmi.js';
let oldMessage:string;
let newMessage:string;

const main = async function (channel: string, content: string, client:tmi.Client ){
	newMessage = content; 
	if(newMessage === oldMessage){
		oldMessage = "";
		client.say(channel, content + ' ');
	}
	else{
		oldMessage = newMessage;
		client.say(channel, content);
	}
}

export async function say(channel: string, content: string, client: tmi.Client){
	try {
		await main(channel, content, client);
	}
	catch (e) {
		console.error(e);
	}
};
