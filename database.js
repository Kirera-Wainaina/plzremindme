const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = `mongodb://${process.env.DB_USERNAME}:\
${process.env.DB_PASSWORD}@${process.env.DB_IP}?w=majority`;

const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.SERVICE_ACCOUNT_PATH
});

exports.mongoClient = new MongoClient(uri);
exports.firestore = firestore;