/**
 * 시니어워크 - 일자리 모듈
 */
import { JOBS, CATEGORIES } from './mockData.js';

const Job = {
  getAll(filters = {}) {
    let jobs = [...JOBS];

    if (filters.category) {
      jobs = jobs.filter((j) => j.category === filters.category);
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw)
      );
    }

    if (filters.maxDistance) {
      jobs = jobs.filter((j) => j.distance <= filters.maxDistance);
    }

    // Sort by distance (closest first) then by newest
    jobs.sort((a, b) => {
      if (a.isUrgent !== b.isUrgent) return b.isUrgent ? 1 : -1;
      return a.distance - b.distance;
    });

    return jobs;
  },

  getById(id) {
    return JOBS.find((j) => j.id === id) || null;
  },

  getCategories() {
    return CATEGORIES;
  },

  getRecommended() {
    // Return closest jobs with high manner temperature employers
    return [...JOBS]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  },

  getNewJobs() {
    return JOBS.filter((j) => j.isNew);
  },

  getUrgentJobs() {
    return JOBS.filter((j) => j.isUrgent);
  },
};

export default Job;
