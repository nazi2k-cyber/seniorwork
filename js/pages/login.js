/**
 * 시니어워크 - 로그인 페이지
 */
import Router from '../router.js';
import Auth from '../modules/auth.js';
import { Icons, showToast } from '../utils.js';

export default function LoginPage() {
  const html = `
    <div class="page" id="login-page">
      <div class="top-nav">
        <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
        <div class="top-nav__title">로그인</div>
        <div style="width: 48px;"></div>
      </div>

      <div style="padding: var(--space-2xl) var(--space-lg);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: var(--space-3xl);">
          <div style="font-size: 64px; margin-bottom: var(--space-lg);">💼</div>
          <h1 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-primary); margin-bottom: var(--space-sm);">
            시니어워크
          </h1>
          <p style="font-size: var(--font-size-md); color: var(--color-text-hint);">
            우리 동네 딱 맞는 일자리
          </p>
        </div>

        <!-- Phone Login -->
        <div class="input-group" style="margin-bottom: var(--space-xl);">
          <label class="input-group__label" for="phone-input">휴대폰 번호</label>
          <div class="input-field">
            <span class="input-field__icon">${Icons.phone}</span>
            <input type="tel" class="input-field__input" id="phone-input"
                   placeholder="010-0000-0000" aria-label="휴대폰 번호 입력"
                   maxlength="13" inputmode="tel">
          </div>
        </div>

        <button class="btn btn--primary btn--full btn--lg" id="btn-login" style="margin-bottom: var(--space-xl);">
          간편 로그인
        </button>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="flex: 1; height: 1px; background: var(--color-border);"></div>
          <span style="font-size: var(--font-size-sm); color: var(--color-text-hint);">또는</span>
          <div style="flex: 1; height: 1px; background: var(--color-border);"></div>
        </div>

        <!-- Social Login -->
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          <button class="btn btn--full btn--lg" id="btn-kakao"
                  style="background-color: #FEE500; color: #191919; font-weight: var(--font-weight-semibold);">
            카카오로 시작하기
          </button>
          <button class="btn btn--full btn--lg" id="btn-naver"
                  style="background-color: #03C75A; color: #FFFFFF; font-weight: var(--font-weight-semibold);">
            네이버로 시작하기
          </button>
        </div>

        <!-- Register -->
        <div style="text-align: center; margin-top: var(--space-2xl);">
          <span style="font-size: var(--font-size-sm); color: var(--color-text-hint);">
            아직 회원이 아니신가요?
          </span>
          <button class="btn btn--ghost" id="btn-register" style="font-size: var(--font-size-sm); color: var(--color-primary); font-weight: var(--font-weight-semibold);">
            회원가입
          </button>
        </div>

        <!-- Guardian Mode -->
        <div style="text-align: center; margin-top: var(--space-xl); padding: var(--space-lg); background: var(--color-surface-variant); border-radius: var(--radius-md);">
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-sm);">
            보호자이신가요?
          </div>
          <button class="btn btn--outline btn--sm" id="btn-guardian">
            보호자 대리 가입
          </button>
        </div>
      </div>
    </div>
  `;

  return {
    html,
    init() {
      const phoneInput = document.getElementById('phone-input');

      // Phone number formatting
      phoneInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 3 && value.length <= 7) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
          value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        e.target.value = value;
      });

      // Login button
      document.getElementById('btn-login')?.addEventListener('click', () => {
        const phone = phoneInput?.value;
        if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
          showToast('올바른 휴대폰 번호를 입력해주세요');
          phoneInput?.focus();
          return;
        }
        Auth.login(phone);
        showToast('로그인 되었습니다!');
        Router.navigate('/');
      });

      // Social login buttons
      document.getElementById('btn-kakao')?.addEventListener('click', () => {
        Auth.login('010-1234-5678');
        showToast('카카오 로그인 완료!');
        Router.navigate('/');
      });

      document.getElementById('btn-naver')?.addEventListener('click', () => {
        Auth.login('010-1234-5678');
        showToast('네이버 로그인 완료!');
        Router.navigate('/');
      });

      // Register
      document.getElementById('btn-register')?.addEventListener('click', () => {
        Router.navigate('/register');
      });

      // Guardian mode
      document.getElementById('btn-guardian')?.addEventListener('click', () => {
        showToast('보호자 대리 가입 기능은 준비 중입니다');
      });

      // Back button
      document.getElementById('btn-back')?.addEventListener('click', () => Router.back());
    },
  };
}
