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
  // TODO: Check credentials (manager)
  const newTrip = new tripModel(req.body);

  newTrip.save((err, trip) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.json(trip);
    }
  });
};

export const update_trip = (req, res) => {
  tripModel.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, (err, trip) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.json(trip);
    }
  });
};

export const delete_trip = (req, res) => {
  tripModel.deleteOne({ _id: req.params.tripId }, (err, trip) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Trip successfully deleted' });
    }
  });
};
