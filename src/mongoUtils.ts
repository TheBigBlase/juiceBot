import settings from "../settings.json";
import {MongoClient, Db, Collection} from 'mongodb';

let _db:Db;
const url = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;



export async function connectToServer( callback:Function ) {
	MongoClient.connect( url, function( err, client:any ) {
		_db  = client.db('juice');
		return callback( err );
	} );
}

export async function getDb(){
	return _db;
}

export async function getCol(col:string){
	return _db.collection(col);
}
