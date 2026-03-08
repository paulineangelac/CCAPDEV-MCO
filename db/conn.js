import {MongoClient} from 'mongodb';

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

export function connectToMongo(callback){
    client.connect((err,client)=>{
        if(err||!client){
            return callback(err);
        }
        return callback();
    })
}

export function getDB(dbname = process.env.DB_NAME){
    return client.db(dbname);
}

function signalHandler(){
    console.log("Closing MongoDB connection...");
    client.close();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
proccess.on('SIGQUIT', signalHandler);