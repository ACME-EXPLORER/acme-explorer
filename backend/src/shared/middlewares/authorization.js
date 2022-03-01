import { StatusCodes } from 'http-status-codes';
import firebase from '../firebase.js';
import { actorModel } from '../../models/actorModel.js';
import { RecordNotFound } from '../exceptions.js';

export const authMiddleware = (req, res, next) => {
  if (req.path.indexOf('register') !== -1 || req.path.indexOf('trips') !== -1) return next();

  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'No token provided' });
  }

  if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
  }

  const token = headerToken.split(' ')[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(async (record) => {
      const user = await actorModel.findOne({ uid: record.uid });
      if (!user) {
        return next(new RecordNotFound());
      }

      req.app.locals.user = user;
      return next();
    })
    .catch((e) => res.status(StatusCodes.FORBIDDEN).json({ message: 'Could not authorize', e }));
};
