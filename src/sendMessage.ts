let oldMessage:string;
let newMessage:string;

const main = async function (channel: string, content: string, client: any){
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

export async function say(channel: string, content: string, client: any){
	try {
		await main(content, client, channel);
	}
	catch (e) {
		console.error(e);
	}
};
