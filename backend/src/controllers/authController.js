import admin from 'firebase-admin';
import { actorModel } from '../models/actorModel.js';

export const getUserId = async (idToken) => {
  const actorFromFB = await admin.auth().verifyIdToken(idToken);

  const uid = actorFromFB.uid;

  const actor = await actorModel.findOne({ email: uid });

  if (!mongoActor) {
    return null;
  } 

  return actor._id;
};

export const verifyUser = (authorizedRoles) => {
  return (req, res, next) => {
    const idToken = req.headers.idtoken;

    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        actorModel.findOne({ email: uid }, (err, actor) => {
          if (err) {
            res.send(err);
          } 
          
          if (!actor) {
            res.status(401);
            res.json({ message: 'Actor not found', error: err });
          } 
            
          const authorizedRolesSet = new Set(authorizedRoles);
          const isAuth = authorizedRolesSet.has(actor.role);

          if (isAuth) {
            return next(null, actor);
          } 

          res.status(403); 
          res.json({ message: 'Not authorized', error: err });     
        });
      })
      .catch((err) => {
        res.status(403); 
        res.json({ message: 'Not authorized', error: err });
      });
  };
};

