import Base from './Base';
import { auth } from "../helpers/firebase";

class IdentityAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'actors';
  }

  async login (payload) {
    const { user } = await auth.signInWithEmailAndPassword(payload.email, payload.password);
    if (!user.emailVerified) {
      await this.logout();
      throw new Error('El email no está confirmado.');
    }

    return user.toJSON();
  }

  logout () {
    return auth.signOut();
  }

  async signup (payload) {
    const { user } = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
    if (!user.emailVerified){
    	await user.sendEmailVerification();
    }
  }

  forgotPassword (email) {
    return auth.sendPasswordResetEmail(email);
  }

  async me () {
     if(!auth.currentUser.isAnonymous){
     	const existingToken = localStorage.getItem('token');
     	const token = await auth.currentUser.getIdToken();
     	if(existingToken !== token){
            localStorage.setItem('token', token);
        }
     }

     return auth.currentUser.toJSON();
  }
}

export default IdentityAPI;
