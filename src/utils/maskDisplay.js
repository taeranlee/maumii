// · • ∙ ⋅ 등 미들닷 류를 '*'로 같은 길이만큼 치환
const MIDDLE_DOTS = /[·•∙⋅]+/g;

export function maskDotsToStars(text) {
  if (!text) return text;
  return text.replace(MIDDLE_DOTS, (m) => '*'.repeat(m.length));
}