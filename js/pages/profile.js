/**
 * 시니어워크 - 프로필 페이지
 */
import Router from '../router.js';
import Store from '../store.js';
import Auth from '../modules/auth.js';
import { Icons, showToast } from '../utils.js';

export default function ProfilePage() {
  const state = Store.getState();
  const user = state.user;

  if (!state.isLoggedIn || !user) {
    return {
      html: `
        <div class="page">
          <div class="top-nav">
            <div class="top-nav__title">내 프로필</div>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon">👤</div>
            <div class="empty-state__title">로그인이 필요합니다</div>
            <div class="empty-state__desc">프로필을 확인하려면<br>먼저 로그인해 주세요</div>
            <button class="btn btn--primary btn--lg" onclick="location.hash='/login'" style="margin-top: var(--space-lg);">
              로그인 하기
            </button>
          </div>
        </div>`,
      init() {},
    };
  }

  const html = `
    <div class="page" id="profile-page">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-header__avatar">
          ${user.name.charAt(0)}
        </div>
        <div class="profile-header__name">${user.name}</div>
        <div class="profile-header__region">
          ${Icons.location} ${user.region}
        </div>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="profile-stats__item">
          <span class="profile-stats__number">${user.mannerTemp}°</span>
          <span class="profile-stats__label">매너온도</span>
        </div>
        <div class="profile-stats__item">
          <span class="profile-stats__number">${user.completedJobs}</span>
          <span class="profile-stats__label">완료한 일</span>
        </div>
        <div class="profile-stats__item">
          <span class="profile-stats__number">${user.reviewCount}</span>
          <span class="profile-stats__label">받은 후기</span>
        </div>
      </div>

      <!-- Manner Temperature -->
      <div style="padding: var(--space-xl) var(--space-lg);">
        <div style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-md);">
          매너 온도
        </div>
        <div class="manner-temp">
          <div class="manner-temp__bar" style="height: 12px;">
            <div class="manner-temp__fill" style="width: ${Math.min(100, (user.mannerTemp / 50) * 100)}%"></div>
          </div>
          <span class="manner-temp__value" style="font-size: var(--font-size-lg);">${user.mannerTemp}°C</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Skills -->
      <div style="padding: var(--space-xl) var(--space-lg);">
        <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
          보유 기술
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
          ${user.skills
            .map(
              (skill) =>
                `<span class="tag tag--primary" style="font-size: var(--font-size-sm); padding: var(--space-sm) var(--space-lg);">${skill}</span>`
            )
            .join('')}
          <button class="tag tag--selectable" id="btn-add-skill" style="border-style: dashed;">
            + 추가
          </button>
        </div>
      </div>

      <!-- Bio -->
      <div style="padding: 0 var(--space-lg) var(--space-xl);">
        <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
          자기소개
        </div>
        <p style="font-size: var(--font-size-md); line-height: var(--line-height-relaxed); color: var(--color-text-secondary);
                  background: var(--color-surface-variant); padding: var(--space-lg); border-radius: var(--radius-md);">
          ${user.bio}
        </p>
      </div>

      <div class="divider"></div>

      <!-- Menu -->
      <div class="menu-list">
        <div class="menu-item" id="menu-edit-profile">
          <span class="menu-item__icon">✏️</span>
          <span class="menu-item__text">프로필 수정</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
        <div class="menu-item" id="menu-my-applications">
          <span class="menu-item__icon">📋</span>
          <span class="menu-item__text">지원 내역</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
        <div class="menu-item" id="menu-my-reviews">
          <span class="menu-item__icon">⭐</span>
          <span class="menu-item__text">받은 후기</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
        <div class="menu-item" id="menu-bookmarks">
          <span class="menu-item__icon">❤️</span>
          <span class="menu-item__text">관심 일자리</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
        <div class="menu-item" id="menu-settings">
          <span class="menu-item__icon">⚙️</span>
          <span class="menu-item__text">설정</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
        <div class="menu-item" id="menu-help">
          <span class="menu-item__icon">❓</span>
          <span class="menu-item__text">도움말</span>
          <span class="menu-item__arrow">${Icons.chevronRight}</span>
        </div>
      </div>

      <div style="padding: var(--space-xl) var(--space-lg);">
        <button class="btn btn--outline btn--full" id="btn-logout">
          로그아웃
        </button>
      </div>

      <div style="text-align: center; padding: var(--space-lg); font-size: var(--font-size-xs); color: var(--color-text-disabled);">
        시니어워크 v1.0.0
      </div>
    </div>
  `;

  return {
    html,
    init() {
      document.getElementById('btn-logout')?.addEventListener('click', () => {
        Auth.logout();
        showToast('로그아웃되었습니다');
        Router.navigate('/');
      });

      document.getElementById('btn-add-skill')?.addEventListener('click', () => {
        showToast('기술 추가 기능은 준비 중입니다');
      });

      // Menu items - show toast for unimplemented features
      ['menu-edit-profile', 'menu-my-applications', 'menu-my-reviews', 'menu-bookmarks', 'menu-settings', 'menu-help'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => {
          showToast('해당 기능은 준비 중입니다');
        });
      });
    },
  };
}
