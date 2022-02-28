import { tripModel } from '../models/tripModel.js';

export const find_all_trips = (req, res) => {
  tripModel.find({}, (err, trips) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(trips);
    }
  });
};

// Find one trip by id
export const find_trip = (req, res) => {
  tripModel.findById(req.params.tripId, (err, trip) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(trip);
    }
  });
};

export const create_trip = (req, res) => {
  console.log(Date() + ' - POST /trips');
  // TODO: Check credentials (manager)

  var trip = {
    title: req.body.title,
    description: req.body.description,
    requirements: req.body.requirements,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    pictures: req.body.pictures,
    state: 'INACTIVE',
    stages: req.body.stages
  }

  const newTrip = new tripModel(trip);

  newTrip.save((err, trip) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.status(201).json(trip.cleanup());
    }
  });
};

// A manager can update and INACTIVE trip
export const update_trip = (req, res) => {
  console.log(Date() + ' - PUT /trips/' + req.params.tripId);
  // TODO: Check credentials (manager)
  // TODO: Check that the trip belongs to the logged manager
  // TODO: Check that the object id fulfills the regex (and return 404 if not)


  tripModel.findById(req.params.tripId, (err, trip) => {
    if(err) {
      res.status(500).send(err);
    } else if (trip) {

      // Check that the trip is INACTIVE
      if (trip.state !== 'INACTIVE') {
        return res.status(400).send('The trip must be INACTIVE');
      }

      var update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          requirements: req.body.requirements,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          pictures: req.body.pictures,
          stages: req.body.stages
        }
      }

      tripModel.findOneAndUpdate({_id: req.params.tripId}, update, {new: true}, function(err, trip) {
        if(err) {
          res.status(500).send(err);
        } else {
          res.json(trip.cleanup());
        }
      });
      } else {
        res.status(404).send({ error: "Trip not found" });
      }
    })
  }

export const delete_trip = (req, res) => {
  tripModel.deleteOne({ _id: req.params.tripId }, (err, trip) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Trip successfully deleted' });
    }
  });
};
