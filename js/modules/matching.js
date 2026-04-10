/**
 * 시니어워크 - 매칭 엔진 모듈
 * 거리 + 기술 적합도 기반 매칭 스코어 산출
 */

const Matching = {
  calculateScore(job, userProfile) {
    let score = 0;

    // 1. 거리 점수 (40% 가중치) - 가까울수록 높은 점수
    const distanceScore = Math.max(0, 100 - (job.distance / 20));
    score += distanceScore * 0.4;

    // 2. 기술 매칭 점수 (30% 가중치)
    if (userProfile && userProfile.skills) {
      const categorySkillMap = {
        cleaning: ['청소', '정리'],
        delivery: ['운전', '배달'],
        guard: ['경비', '관리'],
        cooking: ['요리', '조리'],
        care: ['돌봄', '간병', '간호'],
        parking: ['운전', '관리'],
        tutoring: ['교육', '멘토'],
        errands: ['심부름', '운전'],
      };
      const relatedSkills = categorySkillMap[job.category] || [];
      const matchCount = userProfile.skills.filter((s) =>
        relatedSkills.some((rs) => s.includes(rs) || rs.includes(s))
      ).length;
      const skillScore = relatedSkills.length > 0
        ? (matchCount / relatedSkills.length) * 100
        : 50;
      score += skillScore * 0.3;
    } else {
      score += 50 * 0.3;
    }

    // 3. 고용주 매너 온도 점수 (15% 가중치)
    const mannerScore = Math.min(100, (job.employer.mannerTemp / 45) * 100);
    score += mannerScore * 0.15;

    // 4. 신선도 점수 (15% 가중치) - 최근 게시물 우선
    const hoursSincePosted = (Date.now() - new Date(job.postedAt)) / 3600000;
    const freshnessScore = Math.max(0, 100 - hoursSincePosted * 2);
    score += freshnessScore * 0.15;

    return Math.round(score);
  },

  getMatchLabel(score) {
    if (score >= 80) return '최고 적합';
    if (score >= 60) return '적합';
    if (score >= 40) return '보통';
    return '참고';
  },

  getMatchColor(score) {
    if (score >= 80) return 'var(--color-primary)';
    if (score >= 60) return 'var(--color-info)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-text-hint)';
  },
};

export default Matching;
