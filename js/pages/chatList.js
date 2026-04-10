/**
 * 시니어워크 - 채팅 목록 페이지
 */
import Router from '../router.js';
import Store from '../store.js';
import Chat from '../modules/chat.js';
import Auth from '../modules/auth.js';
import { formatTime } from '../utils.js';

export default function ChatListPage() {
  if (!Auth.isLoggedIn()) {
    return {
      html: `
        <div class="page">
          <div class="top-nav">
            <div class="top-nav__title">채팅</div>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon">💬</div>
            <div class="empty-state__title">로그인이 필요합니다</div>
            <div class="empty-state__desc">채팅을 이용하려면<br>먼저 로그인해 주세요</div>
            <button class="btn btn--primary btn--lg" onclick="location.hash='/login'" style="margin-top: var(--space-lg);">
              로그인 하기
            </button>
          </div>
        </div>`,
      init() {},
    };
  }

  const rooms = Chat.getRooms();

  const html = `
    <div class="page" id="chat-list-page">
      <div class="top-nav">
        <div class="top-nav__title">채팅</div>
      </div>

      ${
        rooms.length > 0
          ? `<div id="chat-rooms-container">
              ${rooms
                .map(
                  (room) => `
                <div class="chat-item" data-room-id="${room.id}">
                  <div class="chat-item__avatar">${room.otherUser.avatar}</div>
                  <div class="chat-item__content">
                    <div class="chat-item__name">${room.otherUser.name}</div>
                    <div class="chat-item__preview">${room.lastMessage}</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-top: 2px;">
                      ${room.jobTitle}
                    </div>
                  </div>
                  <div class="chat-item__meta">
                    <span class="chat-item__time">${formatTime(room.lastMessageAt)}</span>
                    ${room.unreadCount > 0 ? `<span class="chat-item__unread">${room.unreadCount}</span>` : ''}
                  </div>
                </div>
              `
                )
                .join('')}
            </div>`
          : `<div class="empty-state">
              <div class="empty-state__icon">💬</div>
              <div class="empty-state__title">채팅이 없습니다</div>
              <div class="empty-state__desc">일자리에 지원하면<br>채팅방이 자동으로 생성됩니다</div>
              <button class="btn btn--primary btn--lg" onclick="location.hash='/jobs'" style="margin-top: var(--space-lg);">
                일자리 찾아보기
              </button>
            </div>`
      }
    </div>
  `;

  return {
    html,
    init() {
      document.querySelectorAll('.chat-item[data-room-id]').forEach((item) => {
        item.addEventListener('click', () => {
          Router.navigate(`/chat/${item.dataset.roomId}`);
        });
      });
    },
  };
}
