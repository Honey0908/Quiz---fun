export interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
}

export type TeamName = 'A' | 'B';

export interface Scores {
  teamA: number;
  teamB: number;
}

export interface TeamNames {
  teamA: string;
  teamB: string;
}

export interface QuizLocationState {
  teamNames: TeamNames;
}

export interface ResultsLocationState {
  teamNames: TeamNames;
  scores: Scores;
}

export interface PersistedQuizState {
  teamNames: TeamNames;
  currentIndex: number;
  scores: Scores;
  scoredQuestions: Record<number, TeamName>;
  revealed: boolean;
}
