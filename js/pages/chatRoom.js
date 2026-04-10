/**
 * 시니어워크 - 채팅방 페이지
 */
import Router from '../router.js';
import Chat from '../modules/chat.js';
import { Icons, formatTime, escapeHtml, showToast } from '../utils.js';

export default function ChatRoomPage(params = {}) {
  const room = Chat.getRoom(params.id);

  if (!room) {
    return {
      html: `
        <div class="page">
          <div class="top-nav">
            <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
            <div class="top-nav__title">채팅</div>
            <div></div>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon">❌</div>
            <div class="empty-state__title">채팅방을 찾을 수 없습니다</div>
          </div>
        </div>`,
      init() {
        document.getElementById('btn-back')?.addEventListener('click', () => Router.back());
      },
    };
  }

  Chat.markAsRead(room.id);

  const html = `
    <div class="page" id="chat-room-page" style="display: flex; flex-direction: column; padding-bottom: 0;">
      <!-- Header -->
      <div class="top-nav" style="flex-shrink: 0;">
        <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
        <div style="flex: 1; text-align: center;">
          <div class="top-nav__title" style="font-size: var(--font-size-md);">${room.otherUser.name}</div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-top: 1px;">
            ${room.jobTitle}
          </div>
        </div>
        <div style="width: 48px;"></div>
      </div>

      <!-- Messages -->
      <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md); -webkit-overflow-scrolling: touch;">
        <!-- Job Info Banner -->
        <div style="background: var(--color-primary-bg); border-radius: var(--radius-md); padding: var(--space-md) var(--space-lg); text-align: center; font-size: var(--font-size-sm); color: var(--color-primary);">
          📋 '${room.jobTitle}' 관련 채팅방입니다
        </div>

        ${room.messages
          .map(
            (msg) => `
          <div style="display: flex; ${msg.sender === 'me' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
            ${msg.sender !== 'me' ? `<div class="chat-item__avatar" style="width: 40px; height: 40px; font-size: 16px; margin-right: var(--space-sm); flex-shrink: 0;">${room.otherUser.avatar}</div>` : ''}
            <div>
              ${msg.sender !== 'me' ? `<div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: 2px;">${room.otherUser.name}</div>` : ''}
              <div class="chat-bubble chat-bubble--${msg.sender === 'me' ? 'sent' : 'received'}">
                ${escapeHtml(msg.text)}
                <div class="chat-bubble__time">${formatTime(msg.time)}</div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Quick Replies -->
      <div id="quick-replies" style="padding: var(--space-sm) var(--space-lg); display: flex; gap: var(--space-sm); overflow-x: auto; scrollbar-width: none; flex-shrink: 0;">
        ${['안녕하세요!', '네, 감사합니다', '시간 조율 가능할까요?', '확인했습니다']
          .map(
            (text) => `
          <button class="btn btn--sm btn--outline btn--round quick-reply" style="flex-shrink: 0; font-size: var(--font-size-xs);">
            ${text}
          </button>
        `
          )
          .join('')}
      </div>

      <!-- Input Area -->
      <div style="display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md) var(--space-lg);
                  padding-bottom: calc(var(--space-md) + var(--safe-area-bottom));
                  border-top: 1px solid var(--color-border); background: var(--color-surface); flex-shrink: 0;">
        <button class="input-field__stt" id="btn-stt-chat" aria-label="음성 입력">
          ${Icons.mic}
        </button>
        <div class="input-field" style="flex: 1; min-height: 48px;">
          <input type="text" class="input-field__input" id="chat-input"
                 placeholder="메시지를 입력하세요" aria-label="메시지 입력"
                 style="min-height: 44px;">
        </div>
        <button class="btn btn--primary btn--icon" id="btn-send" aria-label="전송" style="flex-shrink: 0;">
          ${Icons.send}
        </button>
      </div>
    </div>
  `;

  return {
    html,
    init() {
      const messagesEl = document.getElementById('chat-messages');
      const chatInput = document.getElementById('chat-input');
      const sendBtn = document.getElementById('btn-send');

      // Scroll to bottom
      function scrollToBottom() {
        if (messagesEl) {
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      }
      scrollToBottom();

      // Send message
      function sendMessage(text) {
        if (!text.trim()) return;
        const msg = Chat.sendMessage(room.id, text.trim());
        if (!msg) return;

        // Append sent message
        const msgHtml = `
          <div style="display: flex; justify-content: flex-end;">
            <div>
              <div class="chat-bubble chat-bubble--sent">
                ${escapeHtml(msg.text)}
                <div class="chat-bubble__time">방금 전</div>
              </div>
            </div>
          </div>`;
        messagesEl.insertAdjacentHTML('beforeend', msgHtml);
        chatInput.value = '';
        scrollToBottom();
      }

      // Send button click
      sendBtn?.addEventListener('click', () => sendMessage(chatInput.value));

      // Enter key
      chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          sendMessage(chatInput.value);
        }
      });

      // Quick replies
      document.querySelectorAll('.quick-reply').forEach((btn) => {
        btn.addEventListener('click', () => sendMessage(btn.textContent.trim()));
      });

      // Listen for new messages (auto reply)
      function onNewMessage(e) {
        if (e.detail.roomId !== room.id) return;
        const msg = e.detail.message;
        const msgHtml = `
          <div style="display: flex; justify-content: flex-start;">
            <div class="chat-item__avatar" style="width: 40px; height: 40px; font-size: 16px; margin-right: var(--space-sm); flex-shrink: 0;">${room.otherUser.avatar}</div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: 2px;">${room.otherUser.name}</div>
              <div class="chat-bubble chat-bubble--received">
                ${escapeHtml(msg.text)}
                <div class="chat-bubble__time">방금 전</div>
              </div>
            </div>
          </div>`;
        messagesEl.insertAdjacentHTML('beforeend', msgHtml);
        scrollToBottom();
        if (navigator.vibrate) navigator.vibrate(100);
      }
      window.addEventListener('chat:newMessage', onNewMessage);

      // STT
      const sttBtn = document.getElementById('btn-stt-chat');
      sttBtn?.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          showToast('음성 인식을 지원하지 않는 브라우저입니다.');
          return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        sttBtn.classList.add('input-field__stt--recording');
        recognition.onresult = (e) => {
          chatInput.value = e.results[0][0].transcript;
          chatInput.focus();
        };
        recognition.onend = () => sttBtn.classList.remove('input-field__stt--recording');
        recognition.onerror = () => sttBtn.classList.remove('input-field__stt--recording');
        recognition.start();
      });

      // Back button
      document.getElementById('btn-back')?.addEventListener('click', () => Router.back());

      // Cleanup
      return () => {
        window.removeEventListener('chat:newMessage', onNewMessage);
      };
    },
  };
}
