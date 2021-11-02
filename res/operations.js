const {MongoClient} = require('mongodb');
const settings = require('../settings');
//2ws1uq2ncq6x21tgwjhh7h0bpqsjs6

const uri = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;

const client = new MongoClient(uri);
const db = client.db(settings.database);
const juicers = db.collection("Juicers");

client.connect();

const add = async function(userId, amount){
	let bank = await getJuice(userId) || 0; // vacuity (is that english halp) check 
	if (bank == 0){
		return await juicers.insertOne({_id: userId, bank: bank});
	}
	await juicers.updateOne({_id:userId}, {$inc:{bank: amount}});
	return 0;
}

const rm = async function(userId, amount){
	let bank = await getJuice(userId) || 0; // vacuity (is that english halp) check 
	if (bank == 0){
		return await juicers.insertOne({_id: userId, bank: bank});
	}
	if(bank < amount) return false; //not enough juice
	await juicers.updateOne({_id:userId}, {bank: {$inc:{bank: -amount}}}); //rm juice
	return true;
}

const give = async function(giverId, recieverId, amount){
	if(!rm(giverId, amount)) return false;//not enough juice
	add(recieverId, amount);
	rm(giverId, amount);
	return true;
}

const getJuice = async function(userId){
	qsdf = await juicers.findOne({_id: userId})
	return qsdf['bank'];
}

module.exports = {
	add:add, 
	rm:rm,
	give:give,
	getJuice:getJuice
}
