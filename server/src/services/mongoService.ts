import { MongoClient } from 'mongodb';

class MongoService {
    private url = 'mongodb://localhost:27017';
    private dbName = 'yoo-app';
    private client = new MongoClient(this.url, { useNewUrlParser: true });
    private db: any = null;

    constructor() {}

    private connect() {
        return new Promise((resolve, reject) => {
            this.client.connect((err: any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('Successfully connected to the database!');

                const db = this.client.db(this.dbName);
                this.db = db;
                resolve(db);
            });
        });
    }

    public getDb() {
        return new Promise((resolve, reject) => {
            if (this.db) resolve(this.db);
            else resolve(this.connect());
        });
    }

    // @ts-ignore
    public insert(collectionName: string, data) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.insertOne(data);
            })
    }

    // @ts-ignore
    public find(collectionName: string, data, skip = 0, limit = 0) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.find(data).skip(skip).limit(limit).toArray();
            })
    }

    public count(collectionName: string, data: any) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.find(data).count();
            })
    }

    public update(collectionName: string, criteria: any, data: any) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.updateOne(criteria, { $set: data });
            })
    }

    public push(collectionName: string, criteria: any, data: any) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.updateOne(criteria, { $push: data });
            });
    }

    public pull(collectionName: string, criteria: any, data: any) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.updateOne(criteria, { $pull: data });
            });
    }

    // @ts-ignore
    public deleteOne(collectionName: string, data) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection(collectionName);
                return collection.deleteOne(data);
            })
    }

    public disconnect(): void {
        if (this.db) {
            this.client.close();
            this.db = null;
        }
    }
}


export {
    MongoService
}