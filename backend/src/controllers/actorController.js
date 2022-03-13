import { actorModel } from '../models/actorModel.js';
import { BasicState } from '../shared/enums.js';
import admin from 'firebase-admin';
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
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
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(err);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
      }
    } else {
      res.json(actor);
    }
  });
};

export const updateActor = async (req, res) => {
  try {
    
    const { actor } = res.locals;

    let access = false;

    if (!actor) {
      res.status(StatusCodes.UNAUTHORIZED).send('Not authorized');
    }

    if(actor.role === Roles.ADMIN) {
       access = true;
    } else if ( actor.id === req.params.actorId) {
       access = true;
    } else {
      res.status(StatusCodes.FORBIDDEN).send('The Actor is trying to update an Actor that is not himself!');
    }
    
    if (access) {
      actorModel.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, (err, actor) => {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(err);
          } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
          }
        } else {
          res.json(actor);
        }
      });
    }
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send('You cannot perform this operation');
  } catch(err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export const deleteActor = (req, res) => {
  actorModel.deleteOne({ _id: req.params.actorId }, (err, actor) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
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
          res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(err);
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
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
          res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(err);
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
      } else {
        res.json(actor);
      }
    }
  );
};

export const login = async (req, res) => {
  const {email, password} = req.query;

  actorModel.findOne({ email }, (err, actor) => {
    if (err) {
      res.send(err);
    } else if (!actor) {
      res.status(StatusCodes.UNAUTHORIZED).send({ message: 'forbidden', error: err });
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async (err, isMatch) => {
        if (err) {
          res.send(err);
        }    
        if (!isMatch) {
          res.status(StatusCodes.UNAUTHORIZED).send({ message: 'forbidden', error: err }); 
        } 
        try {
          actor.customToken = await admin.auth().createCustomToken(actor.email);
          res.json(actor);
        } catch (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
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
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(err);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
      }
    } else {
      res.json(actor);
    }
  });
};

export const self = async (req, res) => {
  try {
    const { actor } = res.locals;

    if(!actor) {
      res.status(StatusCodes.NOT_FOUND).send('Not found');
    }

    res.send(actor);
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};
