import jwt from 'jsonwebtoken';

class Authorization {
  getSecret(): string {
    return process.env.SECRET || '';
  }

  sign(payload: string) {
    return jwt.sign(payload, this.getSecret());
  }

  verify(token: string) {
    return jwt.verify(token, this.getSecret());
  }
}

export const Auth = new Authorization();
