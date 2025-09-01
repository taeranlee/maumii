// src/services/returnzeroClient.js
import api from "../api/api";

export async function rzSanitize(text) {
  if (!text) return text;
  const { data } = await api.post("/api/returnzero/profanity", { text });
  return data?.sanitized ?? data?.sanitized_text ?? text;
}

export async function rzSanitizeBatch(texts) {
  if (!Array.isArray(texts) || texts.length === 0) return [];
  const { data } = await api.post("/api/returnzero/profanity:batch", { texts });
  return Array.isArray(data?.sanitized) ? data.sanitized : texts;
}