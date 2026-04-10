/**
 * 시니어워크 - 인증 모듈
 */
import Store from '../store.js';
import { USER_PROFILE } from './mockData.js';

const Auth = {
  login(phone) {
    // Mock login - simulate phone verification
    const user = { ...USER_PROFILE, phone };
    Store.updateState({
      user,
      isLoggedIn: true,
    });
    Store.persist();
    return user;
  },

  logout() {
    Store.updateState({
      user: null,
      isLoggedIn: false,
    });
    Store.persist();
  },

  isLoggedIn() {
    return Store.getState().isLoggedIn;
  },

  getUser() {
    return Store.getState().user;
  },

  requireAuth(callback) {
    if (Auth.isLoggedIn()) {
      return callback();
    }
    // Redirect to login
    window.location.hash = '/login';
    return null;
  },
};

export default Auth;
