/**
 * 시니어워크 - SPA 해시 라우터
 * Hash-based routing for PWA
 */

const Router = (() => {
  const routes = new Map();
  let currentRoute = null;
  let currentCleanup = null;
  const container = () => document.getElementById('page-content');

  function register(path, handler) {
    routes.set(path, handler);
  }

  function navigate(path, params = {}) {
    const url = params && Object.keys(params).length
      ? `${path}?${new URLSearchParams(params).toString()}`
      : path;
    window.location.hash = url;
  }

  function back() {
    window.history.back();
  }

  function getParams() {
    const hash = window.location.hash.slice(1);
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return {};
    const searchParams = new URLSearchParams(hash.slice(queryIndex + 1));
    return Object.fromEntries(searchParams);
  }

  function getPath() {
    const hash = window.location.hash.slice(1) || '/';
    const queryIndex = hash.indexOf('?');
    return queryIndex === -1 ? hash : hash.slice(0, queryIndex);
  }

  async function resolve() {
    const path = getPath();
    const params = getParams();

    // Find matching route (supports :param patterns)
    let handler = null;
    let routeParams = { ...params };

    for (const [pattern, h] of routes) {
      const match = matchRoute(pattern, path);
      if (match) {
        handler = h;
        routeParams = { ...routeParams, ...match };
        break;
      }
    }

    if (!handler) {
      handler = routes.get('/') || (() => '<div>페이지를 찾을 수 없습니다</div>');
    }

    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    const pageContainer = container();
    if (!pageContainer) return;

    // Render new page
    const result = await handler(routeParams);

    if (typeof result === 'string') {
      pageContainer.innerHTML = result;
    } else if (result && typeof result === 'object') {
      if (result.html) {
        pageContainer.innerHTML = result.html;
      }
      if (result.init) {
        currentCleanup = result.init();
      }
    }

    currentRoute = path;

    // Scroll to top
    pageContainer.scrollTop = 0;
    window.scrollTo(0, 0);

    // Update active tab
    updateActiveTab(path);
  }

  function matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  function updateActiveTab(path) {
    document.querySelectorAll('.tab-bar__item').forEach((item) => {
      const tabPath = item.dataset.path;
      if (tabPath === path || (tabPath !== '/' && path.startsWith(tabPath))) {
        item.classList.add('tab-bar__item--active');
      } else {
        item.classList.remove('tab-bar__item--active');
      }
    });
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    if (!window.location.hash) {
      window.location.hash = '/';
    } else {
      resolve();
    }
  }

  return { register, navigate, back, getParams, getPath, init, resolve };
})();

export default Router;
