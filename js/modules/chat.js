/**
 * 시니어워크 - 채팅 모듈
 */
import { CHAT_ROOMS } from './mockData.js';
import { generateId } from '../utils.js';

const chatData = [...CHAT_ROOMS];

const Chat = {
  getRooms() {
    return chatData.sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );
  },

  getRoom(id) {
    return chatData.find((r) => r.id === id) || null;
  },

  getTotalUnread() {
    return chatData.reduce((sum, r) => sum + r.unreadCount, 0);
  },

  sendMessage(roomId, text) {
    const room = chatData.find((r) => r.id === roomId);
    if (!room) return null;

    const message = {
      id: generateId(),
      text,
      sender: 'me',
      time: new Date().toISOString(),
    };

    room.messages.push(message);
    room.lastMessage = text;
    room.lastMessageAt = message.time;

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        '네, 알겠습니다!',
        '감사합니다. 확인하겠습니다.',
        '좋습니다! 내일 뵙겠습니다.',
        '혹시 궁금한 점 더 있으시면 말씀해 주세요.',
        '시간 맞추어 연락드리겠습니다.',
      ];
      const reply = {
        id: generateId(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
        time: new Date().toISOString(),
      };
      room.messages.push(reply);
      room.lastMessage = reply.text;
      room.lastMessageAt = reply.time;
      room.unreadCount += 1;

      // Dispatch custom event for live update
      window.dispatchEvent(new CustomEvent('chat:newMessage', { detail: { roomId, message: reply } }));
    }, 2000);

    return message;
  },

  markAsRead(roomId) {
    const room = chatData.find((r) => r.id === roomId);
    if (room) {
      room.unreadCount = 0;
    }
  },
};

export default Chat;
