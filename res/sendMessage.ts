let oldMessage:string;
let newMessage:string;

const main = async function (channel: string, content: string, client: any){
	newMessage = content; 
	if(newMessage === oldMessage){
		oldMessage = undefined;
		return client.say(channel, content + ' ');
	}
	else{
		oldMessage = newMessage;
		return client.say(channel, content);
	}
}

exports.run = async(channel: string, content: string, client: any) => {
	try {
		await main(content, client, channel);
	}
	catch (e) {
		console.error(e);
	}
}
