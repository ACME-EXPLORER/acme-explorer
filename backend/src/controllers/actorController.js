import { actorModel } from '../models/actorModel.js';
import { BasicState } from '../shared/enums.js';
import admin from 'firebase-admin';

export const find_all_actors = (req, res) => {
  actorModel.find({}, (err, actors) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(actors);
    }
  });
};

export const find_an_actor = (req, res) => {
  actorModel.findById(req.params.actorId, (err, actor) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(actor);
    }
  });
};

export const create_an_actor = (req, res) => {
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

export const update_an_actor = (req, res) => {
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

export const delete_an_actor = (req, res) => {
  actorModel.deleteOne({ _id: req.params.actorId }, (err, actor) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Actor successfully deleted' });
    }
  });
};

export const ban_an_actor = (req, res) => {
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

export const unban_an_actor = (req, res) => {
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

export const login_an_actor = async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  let customToken;

  actorModel.findOne({ email }, (err, actor) => {
    console.log("Actor", actor);
    if (err) {
      res.send(err);
    } else if (!actor) {
      res.status(401);
      res.json({ message: 'forbidden', error: err });
    } else if (actor.role.includes('CLERK') && actor.validated === false) {
      // an access token is valid, but requires more privileges
      res.status(403);
      res.json({ message: 'forbidden', error: err });
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async (err, isMatch) => {
        if (err) {
          res.send(err);
        } else if (!isMatch) {
          // Password did not match
          res.status(401); // an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err });
        } else {
          try {
            customToken = await admin.auth().createCustomToken(actor.email);
          } catch (error) {
            console.log('Error creating custom token:', error);
          }
          actor.customToken = customToken;
          res.json(actor);
        }
      });
    }
  });
};
