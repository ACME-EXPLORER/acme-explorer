import Base from './Base';
import { auth } from "../helpers/firebase";

class IdentityAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'actors';
  }

  async login (payload) {
    const { user } = await auth.signInWithEmailAndPassword(payload.email, payload.password);
    localStorage.setItem('token', user.toJSON().stsTokenManager.accessToken);
    return this.me();
  }

  logout () {
    return auth.signOut();
  }

  async signup (payload) {
    return this.apiClient.post(`${this.base}/register`, payload);
  }

  forgotPassword (email) {
    return auth.sendPasswordResetEmail(email);
  }

  async me () {
    return this.apiClient.get(`${this.base}/me`);
  }
}

export default IdentityAPI;
