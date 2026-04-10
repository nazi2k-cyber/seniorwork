/**
 * 시니어워크 - 앱 진입점
 * SPA 라우터 초기화 및 전체 앱 부트스트랩
 */
import Router from './router.js';
import Store from './store.js';
import Chat from './modules/chat.js';
import { Icons } from './utils.js';

// Page imports
import HomePage from './pages/home.js';
import JobListPage from './pages/jobList.js';
import JobDetailPage from './pages/jobDetail.js';
import ProfilePage from './pages/profile.js';
import ChatListPage from './pages/chatList.js';
import ChatRoomPage from './pages/chatRoom.js';
import LoginPage from './pages/login.js';
import RegisterPage from './pages/register.js';

// Register routes
Router.register('/', HomePage);
Router.register('/jobs', JobListPage);
Router.register('/jobs/:id', JobDetailPage);
Router.register('/profile', ProfilePage);
Router.register('/chat', ChatListPage);
Router.register('/chat/:id', ChatRoomPage);
Router.register('/login', LoginPage);
Router.register('/register', RegisterPage);

// Initialize app
function initApp() {
  renderTabBar();
  Router.init();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration may fail in dev environment
    });
  }

  // Update chat badge periodically
  setInterval(updateChatBadge, 5000);
  window.addEventListener('chat:newMessage', updateChatBadge);
}

function renderTabBar() {
  const tabBar = document.getElementById('tab-bar');
  if (!tabBar) return;

  const unreadCount = Chat.getTotalUnread();

  const tabs = [
    { path: '/', label: '홈', icon: Icons.home },
    { path: '/jobs', label: '일자리', icon: Icons.briefcase },
    { path: '/chat', label: '채팅', icon: Icons.chat, badge: unreadCount },
    { path: '/profile', label: '내 정보', icon: Icons.user },
  ];

  tabBar.innerHTML = tabs
    .map(
      (tab) => `
    <button class="tab-bar__item" data-path="${tab.path}" aria-label="${tab.label}">
      <span class="tab-bar__icon">${tab.icon}</span>
      <span class="tab-bar__label">${tab.label}</span>
      ${tab.badge ? `<span class="tab-bar__badge">${tab.badge}</span>` : ''}
    </button>
  `
    )
    .join('');

  // Tab click handlers
  tabBar.querySelectorAll('.tab-bar__item').forEach((item) => {
    item.addEventListener('click', () => {
      Router.navigate(item.dataset.path);
    });
  });
}

function updateChatBadge() {
  const unreadCount = Chat.getTotalUnread();
  const chatTab = document.querySelector('.tab-bar__item[data-path="/chat"]');
  if (!chatTab) return;

  const existingBadge = chatTab.querySelector('.tab-bar__badge');
  if (unreadCount > 0) {
    if (existingBadge) {
      existingBadge.textContent = unreadCount;
    } else {
      chatTab.insertAdjacentHTML('beforeend', `<span class="tab-bar__badge">${unreadCount}</span>`);
    }
  } else if (existingBadge) {
    existingBadge.remove();
  }
}

// Boot
document.addEventListener('DOMContentLoaded', initApp);
