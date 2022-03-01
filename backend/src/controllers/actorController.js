import { actorModel } from '../models/actorModel.js';
import { BasicState } from '../shared/enums.js';
import { InactiveUser } from '../shared/index.js';
import firebase from '../shared/firebase.js';
import { StatusCodes } from 'http-status-codes';

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

export const registerExplorer = async (req, res) => {
  try {
    const userPayload = req.body;

    const user = await firebase.auth().createUser({
      email: userPayload.email,
      password: userPayload.password,
      displayName: `${userPayload.firstname} ${userPayload.lastname}`
    });

    const newActor = new actorModel({
      uid: user.uid,
      name: userPayload.firstname,
      surname: userPayload.lastname,
      email: userPayload.email,
      phoneNumber: userPayload.phone,
      address: userPayload.address
    });

    await newActor.save();

    res.status(StatusCodes.CREATED).json(newActor);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
};

export const getMeActor = async (req, res, next) => {
  try {
    const user = req.app.locals.user;
    if (user.isActive()) {
      res.status(StatusCodes.OK).json(user);
    } else {
      return next(new InactiveUser());
    }
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
};
