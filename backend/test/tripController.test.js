import server from '../src/app.js';
import { Server } from '../src/config/server.js';
import { actorModel } from '../src/models/actorModel.js';
import { tripModel } from '../src/models/tripModel.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
const { expect } = chai;

chai.use(chaiHttp)

describe('Trips API endpoints', () => {

    let manager1Test, manager2Test, manager1Id, manager2Id, manager1Token, manager2Token, trip1Id, trip2Id;
    
    beforeAll(async() => {

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
        manager1Id = manager1Test.body.id;
        manager2Id = manager2Test.body.id;

        // Change the role of the created users to manager
        await actorModel.findOneAndUpdate({ _id: manager1Id }, { role: "manager" });
        await actorModel.findOneAndUpdate({ _id: manager2Id }, { role: "manager" });

        // Get the tokens of the users
        manager1Token = await Server.createIdTokenFromCustomToken( manager1Test.body.email );
        manager2Token = await Server.createIdTokenFromCustomToken( manager2Test.body.email );

        // All the trips belong to manager 1
        // Trip 1 (ACTIVE)
        let trip1 = await chai.request(server.instance)
            .post('/v1/trips')
            .set('idtoken', manager1Token)
            .send(
                {
                    "title": "test.trip.active",
                    "description": " second Description of my trip",
                    "requirements": ["first req", "second req"],
                    "startDate": "11/11/2023",
                    "endDate": "12/12/2023",
                    "stages": [
                        {
                            "title": "stage 1",
                            "description": "First stage",
                            "price": 800
                        }
                    ]

                })

        trip1Id = trip1.body.id;
        await tripModel.findOneAndUpdate({ _id: trip1Id }, { state: "ACTIVE" });
        

        // Trip 2 (INACTIVE)
        let trip2 = await chai.request(server.instance)
            .post('/v1/trips')
            .set('idtoken', manager1Token)
            .send(
                {
                    "title": "test.trip.inactive",
                    "description": " second Description of my trip",
                    "requirements": ["first req", "second req"],
                    "startDate": "11/11/2023",
                    "endDate": "12/12/2023",
                    "stages": [
                        {
                            "title": "stage 1",
                            "description": "First stage",
                            "price": 800
                        }
                    ]

                })
        trip2Id = trip2.body.id;

    })

    afterAll(async() => {
        await cleanTestDatabase();
        return server.close();
    })

    describe('/v1/trips - GET', () => {
        it('Should return all ACTIVE an CANCELLED Trips', done => {
            chai.request(server.instance).get('/v1/trips').end((err, res) => {
                expect(res).to.have.status(200);
                // Check that all trips are not INACTIVE
                res.body.records.forEach(trip => {
                    expect(trip.state).to.not.equal("INACTIVE");
                })
                done();
            })
        })
    
    })

    describe('/v1/trips - POST', () => {
        it('Should create a new trip', done => {
            chai
            .request(server.instance)
            .post('/v1/trips')
            .set('idtoken', manager1Token)
            .send({
                title: "sample trip",
                description: "sample description",
                requirements: ["sample requirement"],
                startDate: "2025-01-01",
                endDate: "2025-01-09",
                stages: [
                    {
                        title: "stage 1",
                        description: "sample description",
                        price: 500
                    }
                ]
            }).end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body.manager).to.equal(manager1Id)
                expect(res.body.state).to.equal('INACTIVE')
                done()
            })
        })

        it('Should return an error if the user is not a manager', done => {
            chai.request(server.instance).post('/v1/trips')
            .send({
                title: "sample trip",
                description: "sample description",
                requirements: ["sample requirement"],
                startDate: "2025-01-01",
                endDate: "2025-01-09",
                stages: [
                    {
                        title: "stage 1",
                        description: "sample description",
                        price: 500
                    }
                ]
            }).end((err, res) => {
                expect(res).to.have.status(401)
                done()
            })
        })
    })

    

})

const cleanTestDatabase = async () => {
    await tripModel.deleteMany({ title: /.*test.trip.*/i });
    await actorModel.deleteMany({ email: /.*test.*/i });
  };

