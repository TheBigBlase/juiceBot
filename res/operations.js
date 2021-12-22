const { getDb } = require('./mongoUtils');


const db = getDb();
const juicers = db.collection("Juicers");


const add = async function(userId, amount, juice){
	if (juice == undefined){
		await juicers.insertOne({_id: userId, bank: amount});
		console.log(`created ${amount} to ${userId}`);
		return true;
	}
	await juicers.updateOne({_id:userId}, {$inc:{bank: Math.ceil(amount)}});
	console.log(`added ${amount} to ${userId}`);
	return true;
}

const rm = async function(userId, amount, juice){
	if (juice == undefined){
		await juicers.insertOne({_id: userId, bank: 0});
		console.log(`created ${0} to ${userId}`);
		return false;
	}
	if(juice < amount) return false; //not enough juice
	await juicers.updateOne({_id:userId}, {$inc:{bank: Math.ceil(-amount)}}); //rm juice
	console.log(`removed ${amount} to ${userId}`);
	return true;
}

const give = async function(giverId, recieverId, amount, juiceReciever, juiceGiver){
	if(!rm(giverId, amount, juiceGiver)) return false;//not enough juice
	add(recieverId, amount, juiceReciever);
	return true;
}

const set = async function(userId, amount){
	await juicers.updateOne({_id:userId}, {$set: {bank: Math.ceil(amount)}}); // WARNING undefined issue
	return true;
}

const getJuice = async function(userId){
	let res = await juicers.findOne({_id: userId});
	if(!res || res['bank'] == undefined) return undefined;
	return res['bank'];
}

const getTop = async function(count){
	let top = juicers.aggregate([{$sort : { bank:-1} }, {$limit:count}]);
	let res = [];
	for await ( const k of top){
		res.push(k);
	}
	return res;
}

const usernameToId = async function usernameToId(username){
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



module.exports = {
	usernameToId:usernameToId,
	add:add, 
	rm:rm,
	give:give,
	getJuice:getJuice,
	set:set,
	getTop:getTop
}
