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
    public insert(login, password) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection('users');
                collection.insertOne({login, password});
            })
    }

    // @ts-ignore
    public find(login, password) {
        return this.getDb()
            .then(db => {
                // @ts-ignore
                const collection = db.collection('users');
                // @ts-ignore
                return collection.find({login, password}).toArray();
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