import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/questions — List all questions
router.get('/', async (_req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, question: true, answer: true, explanation: true },
    });
    res.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET /api/questions/:id — Get single question
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid question ID' });
    return;
  }

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      select: { id: true, question: true, answer: true, explanation: true },
    });

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.json(question);
  } catch (error) {
    console.error('Failed to fetch question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// POST /api/questions — Create a new question
router.post('/', async (req, res) => {
  const { question, answer, explanation } = req.body;

  if (!question || !answer || !explanation) {
    res.status(400).json({
      error: 'Fields "question", "answer", and "explanation" are required',
    });
    return;
  }

  if (
    typeof question !== 'string' ||
    typeof answer !== 'string' ||
    typeof explanation !== 'string'
  ) {
    res.status(400).json({ error: 'All fields must be strings' });
    return;
  }

  try {
    const created = await prisma.question.create({
      data: { question, answer, explanation },
      select: { id: true, question: true, answer: true, explanation: true },
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Failed to create question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// PUT /api/questions/:id — Update a question
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid question ID' });
    return;
  }

  const { question, answer, explanation } = req.body;

  if (!question && !answer && !explanation) {
    res.status(400).json({
      error:
        'At least one field ("question", "answer", or "explanation") is required',
    });
    return;
  }

  const data: Record<string, string> = {};
  if (typeof question === 'string') data.question = question;
  if (typeof answer === 'string') data.answer = answer;
  if (typeof explanation === 'string') data.explanation = explanation;

  try {
    const updated = await prisma.question.update({
      where: { id },
      data,
      select: { id: true, question: true, answer: true, explanation: true },
    });
    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    console.error('Failed to update question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE /api/questions/:id — Delete a question
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid question ID' });
    return;
  }

  try {
    await prisma.question.delete({ where: { id } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    console.error('Failed to delete question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
