/**
 * 시니어워크 - 일자리 목록 페이지
 */
import Router from '../router.js';
import Store from '../store.js';
import Job from '../modules/job.js';
import Matching from '../modules/matching.js';
import { Icons, formatPay, walkingTime, formatTime, debounce } from '../utils.js';

export default function JobListPage(params = {}) {
  const categories = Job.getCategories();
  const state = Store.getState();
  const activeCategory = params.category || null;
  const keyword = params.keyword || '';

  const jobs = Job.getAll({
    category: activeCategory,
    keyword,
  });

  const html = `
    <div class="page" id="job-list-page">
      <!-- Header -->
      <div class="top-nav">
        <div class="top-nav__title">일자리 찾기</div>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <span class="input-field__icon">${Icons.search}</span>
        <input type="text" class="search-bar__input" placeholder="일자리 검색 (직종, 지역, 회사명)"
               id="job-search-input" value="${keyword}" aria-label="일자리 검색">
        <button class="input-field__stt" id="btn-stt-jobs" aria-label="음성 검색">
          ${Icons.mic}
        </button>
      </div>

      <!-- Category Filter -->
      <div class="scroll-x" style="padding-bottom: var(--space-md);">
        <button class="tag tag--selectable ${!activeCategory ? 'active' : ''}" data-category="">
          전체
        </button>
        ${categories
          .map(
            (cat) => `
          <button class="tag tag--selectable ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
            ${cat.icon} ${cat.name}
          </button>
        `
          )
          .join('')}
      </div>

      <!-- Results Count -->
      <div style="padding: var(--space-sm) var(--space-lg); font-size: var(--font-size-sm); color: var(--color-text-hint);">
        총 <strong style="color: var(--color-primary)">${jobs.length}</strong>건의 일자리
      </div>

      <!-- Job List -->
      <div id="job-list-container" style="padding: 0 var(--space-lg) var(--space-lg); display: flex; flex-direction: column; gap: var(--space-md);">
        ${
          jobs.length > 0
            ? jobs
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
                  <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: var(--line-height-relaxed);">
                    ${Icons.clock} ${job.workDays} · ${job.workTime}
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
                .join('')
            : `
            <div class="empty-state">
              <div class="empty-state__icon">🔍</div>
              <div class="empty-state__title">검색 결과가 없습니다</div>
              <div class="empty-state__desc">다른 검색어나 카테고리로<br>다시 찾아보세요</div>
            </div>
          `
        }
      </div>
    </div>
  `;

  return {
    html,
    init() {
      // Job card click
      document.querySelectorAll('.job-card[data-job-id]').forEach((card) => {
        card.addEventListener('click', () => {
          Router.navigate(`/jobs/${card.dataset.jobId}`);
        });
      });

      // Category filter
      document.querySelectorAll('.tag--selectable[data-category]').forEach((tag) => {
        tag.addEventListener('click', () => {
          const cat = tag.dataset.category;
          const searchInput = document.getElementById('job-search-input');
          const kw = searchInput ? searchInput.value : '';
          const newParams = {};
          if (cat) newParams.category = cat;
          if (kw) newParams.keyword = kw;
          Router.navigate('/jobs', newParams);
        });
      });

      // Search input
      const searchInput = document.getElementById('job-search-input');
      if (searchInput) {
        const doSearch = debounce((value) => {
          const newParams = {};
          if (activeCategory) newParams.category = activeCategory;
          if (value) newParams.keyword = value;
          Router.navigate('/jobs', newParams);
        }, 500);

        searchInput.addEventListener('input', (e) => doSearch(e.target.value));
        if (keyword) searchInput.focus();
      }

      // STT
      const sttBtn = document.getElementById('btn-stt-jobs');
      if (sttBtn) {
        sttBtn.addEventListener('click', () => {
          if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            import('../utils.js').then(({ showToast }) => {
              showToast('음성 인식을 지원하지 않는 브라우저입니다.');
            });
            return;
          }
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'ko-KR';
          sttBtn.classList.add('input-field__stt--recording');
          recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            if (searchInput) searchInput.value = text;
            const newParams = {};
            if (activeCategory) newParams.category = activeCategory;
            newParams.keyword = text;
            Router.navigate('/jobs', newParams);
          };
          recognition.onend = () => sttBtn.classList.remove('input-field__stt--recording');
          recognition.onerror = () => sttBtn.classList.remove('input-field__stt--recording');
          recognition.start();
        });
      }
    },
  };
}
