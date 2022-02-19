// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from './config/server.js';
// import bodyParser from 'body-parser';
// import express from 'express';

dotenv.config();

const server = new Server();

server.execute();

// const app = express();
// const port = process.env.PORT || 8080;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// MongoDB URI building
// const mongoDBHostname = process.env.mongoDBHostname || 'localhost';
// const mongoDBPort = process.env.mongoDBPort || '27017';
// const mongoDBName = process.env.mongoDBName || 'ACME-Explorer';
// const mongoDBURI = 'mongodb://' + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName;

// mongoose.connect(mongoDBURI);
// console.log('Connecting DB to: ' + mongoDBURI);

// mongoose.connection.on('open', () => {
//   app.listen(port, () => {
//     console.log('ACME-Market RESTful API server started on: ' + port);
//   });
// });

// mongoose.connection.on('error', (err) => {
//   console.error('DB init error ' + err);
// });
