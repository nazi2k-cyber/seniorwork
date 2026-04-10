/**
 * 시니어워크 - 일자리 상세 페이지
 */
import Router from '../router.js';
import Store from '../store.js';
import Job from '../modules/job.js';
import Matching from '../modules/matching.js';
import Auth from '../modules/auth.js';
import { Icons, formatPay, walkingTime, formatTime, showToast } from '../utils.js';

export default function JobDetailPage(params = {}) {
  const job = Job.getById(params.id);

  if (!job) {
    return {
      html: `
        <div class="page">
          <div class="top-nav">
            <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
            <div class="top-nav__title">일자리 상세</div>
            <div></div>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon">❌</div>
            <div class="empty-state__title">일자리를 찾을 수 없습니다</div>
          </div>
        </div>`,
      init() {
        document.getElementById('btn-back')?.addEventListener('click', () => Router.back());
      },
    };
  }

  const state = Store.getState();
  const score = Matching.calculateScore(job, state.user);
  const matchLabel = Matching.getMatchLabel(score);
  const matchColor = Matching.getMatchColor(score);

  const html = `
    <div class="page" id="job-detail-page">
      <!-- Header -->
      <div class="top-nav">
        <button class="top-nav__back" id="btn-back" aria-label="뒤로 가기">${Icons.back}</button>
        <div class="top-nav__title">일자리 상세</div>
        <div class="top-nav__actions">
          <button class="btn--icon" id="btn-bookmark" aria-label="관심 등록">
            ${Icons.heart}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div style="padding: var(--space-xl) var(--space-lg);">
        <!-- Company Info -->
        <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-xl);">
          <div class="job-card__avatar" style="width: 64px; height: 64px; font-size: 32px;">${job.companyIcon}</div>
          <div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: var(--space-xs);">
              ${job.company}
            </div>
            <h1 style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight);">
              ${job.title}
            </h1>
          </div>
        </div>

        <!-- Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-xl);">
          ${job.isUrgent ? '<span class="tag tag--warning" style="font-size: var(--font-size-sm);">급구</span>' : ''}
          ${job.isNew ? '<span class="tag tag--new" style="font-size: var(--font-size-sm);">NEW</span>' : ''}
          <span class="tag tag--primary" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">
            적합도 ${matchLabel} ${score}점
          </span>
        </div>

        <!-- Key Info -->
        <div style="background: var(--color-surface-variant); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: var(--space-xs);">급여</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-primary);">
                ${formatPay(job.payAmount, job.payType)}
              </div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: var(--space-xs);">거리</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">
                ${walkingTime(job.distance)}
              </div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: var(--space-xs);">근무일</div>
              <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-medium);">${job.workDays}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); margin-bottom: var(--space-xs);">근무시간</div>
              <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-medium);">${job.workTime}</div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xl); color: var(--color-text-secondary);">
          ${Icons.location}
          <span style="font-size: var(--font-size-md);">${job.location}</span>
          <span style="font-size: var(--font-size-sm); color: var(--color-text-hint);">
            (${walkingTime(job.distance)})
          </span>
        </div>

        <!-- Description -->
        <div style="margin-bottom: var(--space-xl);">
          <h2 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
            상세 설명
          </h2>
          <p style="font-size: var(--font-size-md); line-height: var(--line-height-relaxed); color: var(--color-text-secondary);">
            ${job.description}
          </p>
        </div>

        <!-- Requirements -->
        <div style="margin-bottom: var(--space-xl);">
          <h2 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
            자격 요건
          </h2>
          ${job.requirements
            .map(
              (req) => `
            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm); font-size: var(--font-size-md); color: var(--color-text-secondary);">
              <span style="color: var(--color-primary);">${Icons.check}</span>
              ${req}
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Benefits -->
        <div style="margin-bottom: var(--space-xl);">
          <h2 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-md);">
            제공 사항
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
            ${job.benefits
              .map(
                (b) => `<span class="tag" style="font-size: var(--font-size-sm);">${b}</span>`
              )
              .join('')}
          </div>
        </div>

        <!-- Employer Info -->
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
          <h2 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-lg);">
            구인자 정보
          </h2>
          <div style="display: flex; align-items: center; gap: var(--space-lg);">
            <div class="chat-item__avatar">${job.employer.avatar}</div>
            <div style="flex: 1;">
              <div style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">
                ${job.employer.name}
              </div>
              <div class="manner-temp" style="margin-top: var(--space-sm);">
                <div class="manner-temp__bar">
                  <div class="manner-temp__fill" style="width: ${Math.min(100, (job.employer.mannerTemp / 50) * 100)}%"></div>
                </div>
                <span class="manner-temp__value">${job.employer.mannerTemp}°C</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Meta -->
        <div style="font-size: var(--font-size-xs); color: var(--color-text-hint); text-align: center; margin-bottom: var(--space-2xl);">
          지원자 ${job.applicants}명 · ${formatTime(job.postedAt)} 등록
        </div>
      </div>

      <!-- Bottom Action -->
      <div style="position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: var(--max-width);
                  padding: var(--space-lg); background: var(--color-surface); border-top: 1px solid var(--color-border);
                  display: flex; gap: var(--space-md); z-index: var(--z-sticky);">
        <button class="btn btn--outline btn--icon" id="btn-call" aria-label="전화 문의" style="flex-shrink: 0;">
          ${Icons.phone}
        </button>
        <button class="btn btn--primary btn--full btn--lg" id="btn-apply">
          지원하기
        </button>
      </div>
    </div>
  `;

  return {
    html,
    init() {
      document.getElementById('btn-back')?.addEventListener('click', () => Router.back());

      document.getElementById('btn-bookmark')?.addEventListener('click', () => {
        showToast('관심 일자리에 추가했습니다');
      });

      document.getElementById('btn-call')?.addEventListener('click', () => {
        showToast('전화 연결 기능은 준비 중입니다');
      });

      document.getElementById('btn-apply')?.addEventListener('click', () => {
        if (!Auth.isLoggedIn()) {
          showToast('로그인이 필요합니다');
          Router.navigate('/login');
          return;
        }
        showToast('지원이 완료되었습니다! 채팅방이 생성됩니다.');
        setTimeout(() => Router.navigate('/chat'), 1500);
      });
    },
  };
}
