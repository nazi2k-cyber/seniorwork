/**
 * 시니어워크 - 전역 상태 관리 (Store)
 * 간단한 Pub/Sub 기반 상태 관리
 */

const Store = (() => {
  const state = {
    user: null,
    isLoggedIn: false,
    currentLocation: null,
    region: '서울 강남구 역삼동',
    jobs: [],
    chatRooms: [],
    notifications: [],
    searchFilters: {
      category: null,
      distance: 2, // km
      keyword: '',
    },
  };

  const listeners = new Map();

  function getState() {
    return { ...state };
  }

  function setState(key, value) {
    if (state[key] !== value) {
      state[key] = value;
      notify(key);
    }
  }

  function updateState(partial) {
    let changed = [];
    for (const [key, value] of Object.entries(partial)) {
      if (state[key] !== value) {
        state[key] = value;
        changed.push(key);
      }
    }
    changed.forEach((key) => notify(key));
  }

  function subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => listeners.get(key).delete(callback);
  }

  function notify(key) {
    if (listeners.has(key)) {
      listeners.get(key).forEach((cb) => cb(state[key], state));
    }
  }

  // Local Storage persistence
  function persist() {
    try {
      const persistData = {
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        region: state.region,
      };
      localStorage.setItem('seniorwork_state', JSON.stringify(persistData));
    } catch (e) {
      // Silently fail for storage errors
    }
  }

  function restore() {
    try {
      const saved = localStorage.getItem('seniorwork_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
    } catch (e) {
      // Silently fail
    }
  }

  // Initialize
  restore();

  return { getState, setState, updateState, subscribe, persist };
})();

export default Store;
