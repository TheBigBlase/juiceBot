const {MongoClient} = require('mongodb');
const settings = require('../settings');
//2ws1uq2ncq6x21tgwjhh7h0bpqsjs6

const uri = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;

const client = new MongoClient(uri);
const db = client.db(settings.database);
const juicers = db.collection("Juicers");

client.connect();

const add = async function(userId, amount, juice){
	if (juice == undefined){
		await juicers.insertOne({_id: userId, bank: amount});
		return true;
	}
	await juicers.updateOne({_id:userId}, {$inc:{bank: amount}});
	return true;
}

const rm = async function(userId, amount, juice){
	if (juice == undefined){
		await juicers.insertOne({_id: userId, bank: 0});
		return;
	}
	if(juice < amount) return false; //not enough juice
	await juicers.updateOne({_id:userId}, {$inc:{bank: -amount}}); //rm juice
	return true;
}

const give = async function(giverId, recieverId, amount, juiceGiver){
	if(!rm(giverId, amount)) return false;//not enough juice
	add(recieverId, amount);
	rm(giverId, amount);
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
