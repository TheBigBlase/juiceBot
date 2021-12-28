import { getDb, getCol } from './mongoUtils';
import {Collection, Db, ObjectId} from 'mongodb';
import settings from '../settings.json';
import axios from 'axios';


const db:any = getDb().collection("Juicers");
const juicers:any = db.collection("Juicers");


export const add = async function(userId:number, amount:number, juice:number){
	if (juice == undefined){
		juicers.insertOne({_id: new ObjectId(userId), bank: amount});
		console.log(`created ${amount} to ${userId}`);
		return true;
	}
	await juicers.updateOne({_id: userId}, {$inc:{bank: Math.ceil(amount)}});
	console.log(`added ${amount} to ${userId}`);
	return true;
}

export const rm = async function(userId:number, amount:number, juice:number){
	if (juice == undefined){
		await juicers.insertOne({_id: new ObjectId(userId), bank: 0});
		console.log(`created ${0} to ${userId}`);
		return false;
	}
	if(juice < amount) return false; //not enough juice
	await juicers.updateOne({_id:userId}, {$inc:{bank: Math.ceil(-amount)}}); //rm juice
	console.log(`removed ${amount} to ${userId}`);
	return true;
}

export const give = async function(giverId:number, recieverId:number, amount:number, juiceReciever:number, juiceGiver:number){
	if(!rm(giverId, amount, juiceGiver)) return false;//not enough juice
	add(recieverId, amount, juiceReciever);
	return true;
}

export const set = async function(userId:number, amount:number){
	await juicers.updateOne({_id:userId}, {$set: {bank: Math.ceil(amount)}}); // WARNING undefined issue
	return true;
}

export const getJuice = async function(userId:number){
	let res = await juicers.findOne({_id: userId});
	if(!res || res['bank'] == undefined) return undefined;
	return res['bank'];
}

export const getTop = async function(count:number){
	console.log(db);
	let top = juicers.aggregate([{$sort : { bank:-1} }, {$limit:count}]);
	let res = [];
	for await ( const k of top){
		res.push(k);
	}
	return res;
}

export const usernameToId = async function usernameToId(username:string){
	let options = {
		headers: {
			'Authorization': `Bearer ${settings.token}`,
			'Client-Id': `${settings.clientID}`
		}
	};
		let res:number|void = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, options)
								.then((res) => {return Number(res.data.data[0].id)})
								.catch((err) => console.log(err));
		if(res==undefined) return -1; 
		else return res;
}
