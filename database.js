const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = `mongodb://${process.env.DB_USERNAME}:\
${process.env.DB_PASSWORD}@${process.env.DB_IP}?w=majority`;

exports.client = new MongoClient(uri);