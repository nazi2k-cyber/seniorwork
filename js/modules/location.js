/**
 * 시니어워크 - 위치 기반 서비스 모듈
 */
import Store from '../store.js';

const Location = {
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('위치 서비스를 사용할 수 없습니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          Store.setState('currentLocation', location);
          resolve(location);
        },
        (err) => {
          // Default to Gangnam
          const defaultLocation = { lat: 37.4979, lng: 127.0276 };
          Store.setState('currentLocation', defaultLocation);
          resolve(defaultLocation);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  },

  getRegion() {
    return Store.getState().region;
  },

  setRegion(region) {
    Store.setState('region', region);
    Store.persist();
  },

  getDistanceLabel(meters) {
    if (meters < 500) return '매우 가까움';
    if (meters < 1000) return '가까움';
    if (meters < 2000) return '보통';
    return '다소 멀음';
  },
};

export default Location;
