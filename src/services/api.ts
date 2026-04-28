import type { Question } from '../types';

const API_BASE = '/api';

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch questions: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function createQuestion(
  data: Omit<Question, 'id'>,
): Promise<Question> {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to create question: ${res.status}`);
  }
  return res.json();
}

export async function updateQuestion(
  id: number,
  data: Partial<Omit<Question, 'id'>>,
): Promise<Question> {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update question: ${res.status}`);
  }
  return res.json();
}

export async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to delete question: ${res.status}`);
  }
}
