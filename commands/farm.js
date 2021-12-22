const settings = require('../settings');
const ops = require('../res/operations');

async function main(args, channel, context, client){

}

exports.run = async (channel, context, msg, self, args, uptime, client) => {
	try {
			// Connect to the MongoDB cluster
		await main(args, channel, context, client);
	} 
	catch (e) {
		console.log(channel);
		console.error(e);
	}
}
