const {MongoClient} = require('mongodb');
const settings = require('../settings');

const uri = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;

const client = new MongoClient(uri);
const db = client.db(settings.database);
const juicers = db.collection("Juicers");

client.connect();

const add = async function(userId, amount, juice){
	if (juice == undefined){
		await juicers.insertOne({_id: userId, bank: amount});
		console.log(`created ${amount} to ${userId}`);
		return true;
	}
	await juicers.updateOne({_id:userId}, {$inc:{bank: amount}});
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
	await juicers.updateOne({_id:userId}, {$inc:{bank: -amount}}); //rm juice
	console.log(`removed ${amount} to ${userId}`);
	return true;
}

const give = async function(giverId, recieverId, amount, juiceReciever, juiceGiver){
	if(!rm(giverId, amount, juiceGiver)) return false;//not enough juice
	add(recieverId, amount, juiceReciever);
	return true;
}

const set = async function(userId, amount){
	await juicers.updateOne({_id:userId}, {$set: {bank: amount}}); // WARNING undefined issue
	return true;
}

const getJuice = async function(userId){
	res = await juicers.findOne({_id: userId});
	if(!res || res['bank'] == undefined) return undefined;
	return res['bank'];
}

module.exports = {
	add:add, 
	rm:rm,
	give:give,
	getJuice:getJuice,
	set:set
}
