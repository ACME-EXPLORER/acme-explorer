import server from '../src/app.js';
import { Server } from '../src/config/server.js';
import { actorModel } from '../src/models/actorModel.js';
import { tripModel } from '../src/models/tripModel.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
const { expect } = chai;

chai.use(chaiHttp)

describe('Trips API endpoints', () => {
    const base = '/v1/trips';
    
    beforeAll(async() => {

        let manager1Test, manager2Test, token;
        // This manager is the owner of all the trips
        manager1Test = {
            name: "manager1",
            surname: "manager1",
            email: "test.manager1@gmail.com",
            password: "abc123",
            role: "manager",
            state: "active"
        };
        // This manager will try to edit trips that do not belong to him
        manager2Test = {
            name: "manager2",
            surname: "manager2",
            email: "test.manager2@gmail.com",
            password: "abc123",
            role: "manager",
            state: "active"
        }

        manager1Test = await chai.request(server.instance).post('/v1/register').send(manager1Test)
        manager2Test = await chai.request(server.instance).post('/v1/register').send(manager2Test)

        // Get the id of the created users
        let manager1Id = manager1Test.body.id;
        let manager2Id = manager2Test.body.id;

        // Change the role of the created users to manager
        await actorModel.findOneAndUpdate({ _id: manager1Id }, { role: "manager" });
        await actorModel.findOneAndUpdate({ _id: manager2Id }, { role: "manager" });

        // Get the tokens of the users
        let manager1Token = await Server.createIdTokenFromCustomToken( manager1Test.body.email );
        let manager2Token = await Server.createIdTokenFromCustomToken( manager2Test.body.email );

    })

    afterAll(async() => {
        await cleanTestDatabase();
        return server.close();
    })

    describe('List all Trips', () => {
        it('Welcome to simple test', done => {
            chai.request(server.instance).get('/v1/trips').end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
        })
    
    })

})

const cleanTestDatabase = async () => {
    await tripModel.deleteMany({ name: /.*test.search.*/i });
    await actorModel.deleteMany({ email: /.*test.*/i });
  };

