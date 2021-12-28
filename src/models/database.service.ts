import * as mongoDB from "mongodb";
import settings from "../../settings.json"

export const collections: { juicers?: mongoDB.Collection } = {}

export async function connectToDatabase() {

	const url = `mongodb://${settings.username}:${settings.password}@${settings.ip}:${settings.port}/${settings.database}`;
	const client: mongoDB.MongoClient = new mongoDB.MongoClient(url);
	await client.connect();

	const db: mongoDB.Db = client.db(settings.database);
	const juicersCollection: mongoDB.Collection = db.collection("juicers");
	collections.juicers = juicersCollection;

	console.log(`Successfully connected to database: ${db.databaseName} and collection: ${juicersCollection.collectionName}`);
}
