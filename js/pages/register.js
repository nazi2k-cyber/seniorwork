/**
 * 시니어워크 - 회원가입 페이지
 */
import Router from '../router.js';
import Auth from '../modules/auth.js';
import { Icons, showToast } from '../utils.js';

export default function RegisterPage() {
  const html = `
    <div class="page" id="register-page">
      <div class="top-nav">
        <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
        <div class="top-nav__title">회원가입</div>
        <div style="width: 48px;"></div>
      </div>

      <div style="padding: var(--space-xl) var(--space-lg);">
        <!-- Progress -->
        <div style="display: flex; gap: var(--space-xs); margin-bottom: var(--space-2xl);">
          <div style="flex: 1; height: 4px; border-radius: 2px; background: var(--color-primary);"></div>
          <div style="flex: 1; height: 4px; border-radius: 2px; background: var(--color-primary);"></div>
          <div style="flex: 1; height: 4px; border-radius: 2px; background: var(--color-border);"></div>
        </div>

        <h2 style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm);">
          기본 정보를 알려주세요
        </h2>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-hint); margin-bottom: var(--space-2xl);">
          간단한 정보만 입력하면 바로 시작할 수 있어요
        </p>

        <!-- Name -->
        <div class="input-group" style="margin-bottom: var(--space-xl);">
          <label class="input-group__label" for="reg-name">이름</label>
          <div class="input-field">
            <input type="text" class="input-field__input" id="reg-name"
                   placeholder="이름을 입력하세요" aria-label="이름 입력">
            <button class="input-field__stt" aria-label="음성 입력">${Icons.mic}</button>
          </div>
        </div>

        <!-- Phone -->
        <div class="input-group" style="margin-bottom: var(--space-xl);">
          <label class="input-group__label" for="reg-phone">휴대폰 번호</label>
          <div class="input-field">
            <span class="input-field__icon">${Icons.phone}</span>
            <input type="tel" class="input-field__input" id="reg-phone"
                   placeholder="010-0000-0000" aria-label="휴대폰 번호 입력"
                   maxlength="13" inputmode="tel">
          </div>
        </div>

        <!-- Region -->
        <div class="input-group" style="margin-bottom: var(--space-xl);">
          <label class="input-group__label" for="reg-region">동네 설정</label>
          <div class="input-field" style="cursor: pointer;" id="btn-set-region">
            <span class="input-field__icon">${Icons.location}</span>
            <input type="text" class="input-field__input" id="reg-region"
                   placeholder="현재 위치로 동네 설정" readonly aria-label="동네 설정"
                   style="cursor: pointer;">
          </div>
        </div>

        <!-- Skills -->
        <div class="input-group" style="margin-bottom: var(--space-2xl);">
          <label class="input-group__label">관심 분야 (선택)</label>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-sm);">
            ${['청소', '요리', '돌봄', '배달', '경비', '교육', '심부름', '운전']
              .map(
                (skill) => `
              <button class="tag tag--selectable skill-tag" data-skill="${skill}">
                ${skill}
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <button class="btn btn--primary btn--full btn--lg" id="btn-register-submit">
          가입 완료
        </button>

        <p style="text-align: center; font-size: var(--font-size-xs); color: var(--color-text-hint); margin-top: var(--space-xl); line-height: var(--line-height-relaxed);">
          가입하시면 서비스 이용약관 및<br>개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  `;

  return {
    html,
    init() {
      const selectedSkills = new Set();

      // Skill selection
      document.querySelectorAll('.skill-tag').forEach((tag) => {
        tag.addEventListener('click', () => {
          const skill = tag.dataset.skill;
          if (selectedSkills.has(skill)) {
            selectedSkills.delete(skill);
            tag.classList.remove('active');
          } else {
            selectedSkills.add(skill);
            tag.classList.add('active');
          }
        });
      });

      // Phone formatting
      const phoneInput = document.getElementById('reg-phone');
      phoneInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 3 && value.length <= 7) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
          value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        e.target.value = value;
      });

      // Region setting
      document.getElementById('btn-set-region')?.addEventListener('click', () => {
        const regionInput = document.getElementById('reg-region');
        if (regionInput) {
          regionInput.value = '서울 강남구 역삼동';
          showToast('동네가 설정되었습니다');
        }
      });

      // Submit
      document.getElementById('btn-register-submit')?.addEventListener('click', () => {
        const name = document.getElementById('reg-name')?.value;
        const phone = document.getElementById('reg-phone')?.value;

        if (!name) {
          showToast('이름을 입력해 주세요');
          return;
        }
        if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
          showToast('올바른 휴대폰 번호를 입력해 주세요');
          return;
        }

        Auth.login(phone);
        showToast('회원가입이 완료되었습니다!');
        Router.navigate('/');
      });

      // Back
      document.getElementById('btn-back')?.addEventListener('click', () => Router.back());
    },
  };
}
