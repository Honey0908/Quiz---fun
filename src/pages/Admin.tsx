import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../services/api';

interface QuestionForm {
  question: string;
  answer: string;
  explanation: string;
}

const emptyForm: QuestionForm = { question: '', answer: '', explanation: '' };

export default function Admin() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadQuestions = async () => {
    try {
      setError(null);
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> & { preventDefault: () => void },
  ) => {
    e.preventDefault();
    setFormError(null);

    if (
      !form.question.trim() ||
      !form.answer.trim() ||
      !form.explanation.trim()
    ) {
      setFormError('All fields are required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId === null) {
        const created = await createQuestion(form);
        setQuestions((prev) => [...prev, created]);
      } else {
        const updated = await updateQuestion(editingId, form);
        setQuestions((prev) =>
          prev.map((q) => (q.id === editingId ? updated : q)),
        );
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to save question',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
    });
    setFormError(null);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setDeletingId(null);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete question',
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <p className="admin-loading">⏳ Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="admin-back-btn" onClick={() => navigate('/')}>
          ← Home
        </button>
        <h1 className="admin-title">⚙️ Manage Questions</h1>
        <span className="admin-count">{questions.length} questions</span>
      </header>

      {error && (
        <div className="admin-error">
          ❌ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form-title">
          {editingId === null ? '➕ Add New Question' : '✏️ Edit Question'}
        </h2>

        <div className="admin-field">
          <label htmlFor="admin-question">Question</label>
          <textarea
            id="admin-question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Enter the question..."
            rows={2}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="admin-answer">Answer</label>
          <textarea
            id="admin-answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Enter the answer..."
            rows={2}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="admin-explanation">Explanation</label>
          <textarea
            id="admin-explanation"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            placeholder="Enter the explanation..."
            rows={3}
          />
        </div>

        {formError && <p className="admin-form-error">⚠️ {formError}</p>}

        <div className="admin-form-actions">
          <button
            type="submit"
            className="admin-btn admin-btn-save"
            disabled={isSaving}
          >
            {(() => {
              if (isSaving) return '💾 Saving...';
              if (editingId === null) return '➕ Add Question';
              return '💾 Update';
            })()}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="admin-btn admin-btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ── Questions List ── */}
      <div className="admin-list">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={`admin-card ${editingId === q.id ? 'admin-card-editing' : ''}`}
          >
            <div className="admin-card-header">
              <span className="admin-card-num">Q{i + 1}</span>
              <span className="admin-card-id">ID: {q.id}</span>
            </div>

            <p className="admin-card-question">{q.question}</p>
            <p className="admin-card-answer">
              <strong>Answer:</strong> {q.answer}
            </p>
            <p className="admin-card-explanation">
              <strong>Explanation:</strong> {q.explanation}
            </p>

            <div className="admin-card-actions">
              <button
                className="admin-btn admin-btn-edit"
                onClick={() => handleEdit(q)}
              >
                ✏️ Edit
              </button>
              {deletingId === q.id ? (
                <div className="admin-delete-confirm">
                  <span>Delete this question?</span>
                  <button
                    className="admin-btn admin-btn-delete-yes"
                    onClick={() => handleDelete(q.id)}
                  >
                    Yes, delete
                  </button>
                  <button
                    className="admin-btn admin-btn-cancel-sm"
                    onClick={() => setDeletingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="admin-btn admin-btn-delete"
                  onClick={() => setDeletingId(q.id)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <p className="admin-empty">No questions yet. Add one above! ☝️</p>
        )}
      </div>
    </div>
  );
}
