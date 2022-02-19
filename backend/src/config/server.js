import bodyParser from 'body-parser';
import express from 'express';
import { dbConnection } from '../database/config.js';

export class Server {
  constructor() {
    this.app = express();

    this.port = process.env.PORT || 8080;

    dbConnection();
  }

  middlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // End Points
  }

  execute() {
    this.middlewares();
    this.app.listen(this.port, () => {
      console.log('ACME-Explorer REST API server started on: ' + this.port);
    });
  }
}
