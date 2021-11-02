const {MongoClient} = require('mongodb');
const settings = require('../settings');
global.mongo = global.mongo || {};
//2ws1uq2ncq6x21tgwjhh7h0bpqsjs6

const uri = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;

const client = new MongoClient(uri);
const db = client.db(settings.database);
const juicers = db.collection("Juicers");

if (!global.mongo.client){
	global.mongo.client = new MongoClient(uri);
	global.mongo.client.connect();
}

const add = async function(userId, amount){
	let bank = await getJuice(userId);
	if (!bank){
		return await juicers.insertOne({id: userId, bank: bank});
	}
	await juicers.updateOne({id:userId}, {bank: {$inc:{bank: amount}}});
	return 0;
}

const rm = async function(userId, amount){
	let bank = await getJuice(userId);
	if(bank < amount) return false; //not enough juice
	await juicers.updateOne({id:userId}, {bank: {$inc:{bank: -amount}}}); //rm juice
	return true;
}

const give = async function(giverId, recieverId, amount){
	if(!rm(giverId, amount)) return false;//not enough juice
	add(recieverId, amount);
	rm(giverId, amount);
	return true;
}

const getJuice = async function(userId){
	return await juicers.findOne({id: userId})['amount'];
}

module.exports = {
	add:add, 
	rm:rm,
	give:give,
	getJuice:getJuice
}
