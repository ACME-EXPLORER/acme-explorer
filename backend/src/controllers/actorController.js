import { actorModel } from '../models/actorModel.js';
import { BasicState } from '../shared/enums.js';
import admin from 'firebase-admin';

export const findActors = (req, res) => {
  actorModel.find({}, (err, actors) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(actors);
    }
  });
};

export const findActor = (req, res) => {
  actorModel.findById(req.params.actorId, (err, actor) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(actor);
    }
  });
};

export const createActor = (req, res) => {
  const newActor = new actorModel(req.body);

  newActor.save((err, actor) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.json(actor);
    }
  });
};

export const updateActor = (req, res) => {
  actorModel.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, (err, actor) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.json(actor);
    }
  });
};

export const deleteActor = (req, res) => {
  actorModel.deleteOne({ _id: req.params.actorId }, (err, actor) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Actor successfully deleted' });
    }
  });
};

export const banActor = (req, res) => {
  actorModel.findOneAndUpdate(
    { _id: req.params.actorId },
    { state: BasicState.INACTIVE },
    { new: true },
    (err, actor) => {
      if (err) {
        if (err.name === 'ValidationError') {
          res.status(422).send(err);
        } else {
          res.status(500).send(err);
        }
      } else {
        res.json(actor);
      }
    }
  );
};

export const unbanActor = (req, res) => {
  actorModel.findOneAndUpdate(
    { _id: req.params.actorId },
    { state: BasicState.ACTIVE },
    { new: true },
    (err, actor) => {
      if (err) {
        if (err.name === 'ValidationError') {
          res.status(422).send(err);
        } else {
          res.status(500).send(err);
        }
      } else {
        res.json(actor);
      }
    }
  );
};

export const login = async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  actorModel.findOne({ email }, (err, actor) => {
    if (err) {
      res.send(err);
    } else if (!actor) {
      res.status(401).send({ message: 'forbidden', error: err });
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async (err, isMatch) => {
        if (err) {
          res.send(err);
        }    
        if (!isMatch) {
          res.status(401).send({ message: 'forbidden', error: err }); 
        } 
        try {
          actor.customToken = await admin.auth().createCustomToken(actor.email);
          res.json(actor);
        } catch (error) {
          res.status(500).send(error);
        }
      });
    }
  });
};

export const register = async (req, res) => {
  delete req.body.role;
  delete req.body.state;
  delete req.body.customToken;
  delete req.body.idToken;

  const newActor = new actorModel(req.body);

  newActor.save((err, actor) => {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.json(actor);
    }
  });
};
