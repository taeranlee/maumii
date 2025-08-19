// mockData.js
export const mockMemories = [
  { m_id: 1, m_name: "이태란님과의 대화" },
  { m_id: 2, m_name: "곽채연님과의 대화" },
  { m_id: 3, m_name: "장연정님과의 대화" },
  { m_id: 4, m_name: "곽민준님과의 대화" }
];

export const mockRecords = [
  { r_id: 1, r_time: "23:07:15", r_date: "2025-05-05", m_id: 1 },
  { r_id: 2, r_time: "23:07:15", r_date: "2025-05-06", m_id: 1 },
  { r_id: 3, r_time: "23:07:15", r_date: "2025-05-07", m_id: 1 },
  { r_id: 4, r_time: "23:07:15", r_date: "2025-05-08", m_id: 1 }
];

export const mockTalks = [
  { t_id: 1, message: "안녕~~ 너진짜 웃긴다", t_talker: true, r_id: 1 },
  { t_id: 2, message: "고마워 칭찬이지?", t_talker: false, r_id: 1 },
  { t_id: 3, message: "너 진짜 나한테 왜그래", t_talker: true, r_id: 1 },
  { t_id: 4, message: "왜그래~", t_talker: false, r_id: 2 },
  { t_id: 5, message: "나 어제 되게 기분 좋아서~~~", t_talker: true, r_id: 2 }
];