/**
 * 시니어워크 - 홈 페이지
 */
import Router from '../router.js';
import Store from '../store.js';
import Job from '../modules/job.js';
import Matching from '../modules/matching.js';
import { Icons, formatPay, walkingTime, formatTime } from '../utils.js';

export default function HomePage() {
  const state = Store.getState();
  const categories = Job.getCategories();
  const recommended = Job.getRecommended();
  const urgentJobs = Job.getUrgentJobs();

  const html = `
    <div class="page" id="home-page">
      <!-- Header -->
      <div class="top-nav">
        <div class="top-nav__title">시니어워크</div>
        <div class="top-nav__actions">
          <button class="btn--icon top-nav__back" id="btn-notification" aria-label="알림">
            ${Icons.bell}
          </button>
        </div>
      </div>

      <!-- Location Bar -->
      <button class="location-bar" id="btn-location" aria-label="현재 동네 설정">
        <span class="location-bar__icon">${Icons.location}</span>
        <span class="location-bar__text">${state.region || '동네 설정'}</span>
        <span class="location-bar__arrow">${Icons.chevronRight}</span>
      </button>

      <!-- Banner -->
      <div class="banner" id="banner-main">
        <div class="banner__title">우리 동네<br>딱 맞는 일자리</div>
        <div class="banner__desc">가까운 거리, 적합한 업무만 골라서<br>편하게 일해보세요</div>
        <button class="btn btn--sm" style="background:rgba(255,255,255,0.25);color:#fff" onclick="location.hash='/jobs'">
          일자리 찾기
        </button>
        <div class="banner__icon">💼</div>
      </div>

      <!-- Search Bar -->
      <div class="search-bar" id="search-bar-home">
        <span class="input-field__icon">${Icons.search}</span>
        <input type="text" class="search-bar__input" placeholder="어떤 일자리를 찾으시나요?"
               id="home-search" readonly aria-label="일자리 검색">
        <button class="input-field__stt" id="btn-stt-home" aria-label="음성 검색">
          ${Icons.mic}
        </button>
      </div>

      <!-- Categories -->
      <div class="section-header">
        <h2 class="section-header__title">카테고리</h2>
      </div>
      <div class="category-grid">
        ${categories
          .map(
            (cat) => `
          <button class="category-item" data-category="${cat.id}" aria-label="${cat.name} 카테고리">
            <div class="category-item__icon">${cat.icon}</div>
            <span class="category-item__name">${cat.name}</span>
          </button>
        `
          )
          .join('')}
      </div>

      <div class="divider"></div>

      ${
        urgentJobs.length > 0
          ? `
        <!-- Urgent Jobs -->
        <div class="section-header">
          <h2 class="section-header__title">급구! 지금 바로 지원</h2>
          <button class="section-header__more" onclick="location.hash='/jobs'">더보기 ></button>
        </div>
        <div class="scroll-x" style="padding-bottom: var(--space-lg)">
          ${urgentJobs
            .map(
              (job) => `
            <div class="job-card" style="width: 280px" data-job-id="${job.id}">
              <div class="job-card__header">
                <div class="job-card__avatar">${job.companyIcon}</div>
                <div class="job-card__info">
                  <div class="job-card__title">${job.title}</div>
                  <div class="job-card__company">${job.company}</div>
                </div>
              </div>
              <div class="job-card__tags">
                <span class="tag tag--new">급구</span>
                <span class="tag tag--primary">${walkingTime(job.distance)}</span>
              </div>
              <div class="job-card__meta">
                <span class="job-card__location">${Icons.location} ${job.location.split(' ').pop()}</span>
                <span class="job-card__pay">${formatPay(job.payAmount, job.payType)}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="divider"></div>
      `
          : ''
      }

      <!-- Recommended Jobs -->
      <div class="section-header">
        <h2 class="section-header__title">내 주변 추천 일자리</h2>
        <button class="section-header__more" onclick="location.hash='/jobs'">전체보기 ></button>
      </div>
      <div style="padding: 0 var(--space-lg) var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md);">
        ${recommended
          .map((job) => {
            const score = Matching.calculateScore(job, state.user);
            const matchLabel = Matching.getMatchLabel(score);
            return `
            <div class="job-card" data-job-id="${job.id}">
              <div class="job-card__header">
                <div class="job-card__avatar">${job.companyIcon}</div>
                <div class="job-card__info">
                  <div class="job-card__title">${job.title}</div>
                  <div class="job-card__company">${job.company}</div>
                </div>
              </div>
              <div class="job-card__tags">
                ${job.isNew ? '<span class="tag tag--new">NEW</span>' : ''}
                ${job.isUrgent ? '<span class="tag tag--warning">급구</span>' : ''}
                <span class="tag tag--primary">${matchLabel} ${score}점</span>
                <span class="tag">${walkingTime(job.distance)}</span>
              </div>
              <div class="job-card__meta">
                <span class="job-card__location">
                  ${Icons.location} ${job.location.split(' ').pop()} · ${formatTime(job.postedAt)}
                </span>
                <span class="job-card__pay">${formatPay(job.payAmount, job.payType)}</span>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>

    <style>
      .location-bar {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-md) var(--space-lg);
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-family: inherit;
      }
      .location-bar__icon { color: var(--color-primary); display: flex; }
      .location-bar__text { font-weight: var(--font-weight-semibold); }
      .location-bar__arrow { color: var(--color-text-hint); display: flex; margin-left: auto; }
    </style>
  `;

  return {
    html,
    init() {
      // Job card click handlers
      document.querySelectorAll('.job-card[data-job-id]').forEach((card) => {
        card.addEventListener('click', () => {
          Router.navigate(`/jobs/${card.dataset.jobId}`);
        });
      });

      // Category click handlers
      document.querySelectorAll('.category-item[data-category]').forEach((item) => {
        item.addEventListener('click', () => {
          Router.navigate('/jobs', { category: item.dataset.category });
        });
      });

      // Search bar click
      const searchBar = document.getElementById('home-search');
      if (searchBar) {
        searchBar.addEventListener('click', () => {
          Router.navigate('/jobs');
        });
      }

      // STT button
      const sttBtn = document.getElementById('btn-stt-home');
      if (sttBtn) {
        sttBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startSTT();
        });
      }
    },
  };
}

function startSTT() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    import('../utils.js').then(({ showToast }) => {
      showToast('음성 인식을 지원하지 않는 브라우저입니다.');
    });
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.continuous = false;

  const sttBtn = document.getElementById('btn-stt-home');
  if (sttBtn) sttBtn.classList.add('input-field__stt--recording');

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    Router.navigate('/jobs', { keyword: text });
  };

  recognition.onend = () => {
    if (sttBtn) sttBtn.classList.remove('input-field__stt--recording');
  };

  recognition.onerror = () => {
    if (sttBtn) sttBtn.classList.remove('input-field__stt--recording');
  };

  recognition.start();
}
