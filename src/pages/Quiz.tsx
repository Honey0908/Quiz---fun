import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Scoreboard from '../components/Scoreboard';
import QuestionCard from '../components/QuestionCard';
import BottomNav from '../components/BottomNav';
import type {
  QuizLocationState,
  TeamName,
  Scores,
  TeamNames,
  PersistedQuizState,
} from '../types';
import { questions } from '../data/questions';

const SESSION_KEY = 'ai-quiz-state';

function loadSession(): PersistedQuizState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PersistedQuizState) : null;
  } catch {
    return null;
  }
}

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as QuizLocationState | null;

  // Fresh router state (new quiz) takes priority; otherwise restore from session
  const [teamNames] = useState<TeamNames>(
    () =>
      locationState?.teamNames ??
      loadSession()?.teamNames ?? { teamA: 'Team A', teamB: 'Team B' },
  );

  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    locationState?.teamNames ? 0 : (loadSession()?.currentIndex ?? 0),
  );
  const [scores, setScores] = useState<Scores>(() =>
    locationState?.teamNames
      ? { teamA: 0, teamB: 0 }
      : (loadSession()?.scores ?? { teamA: 0, teamB: 0 }),
  );
  const [scoredQuestions, setScoredQuestions] = useState<
    Record<number, TeamName>
  >(() =>
    locationState?.teamNames ? {} : (loadSession()?.scoredQuestions ?? {}),
  );
  const [revealed, setRevealed] = useState<boolean>(() =>
    locationState?.teamNames ? false : (loadSession()?.revealed ?? false),
  );
  const [awaitingTeam, setAwaitingTeam] = useState(false);
  const [scoreFlash, setScoreFlash] = useState<TeamName | null>(null);

  // Persist entire quiz state to sessionStorage on every relevant change
  useEffect(() => {
    const toSave: PersistedQuizState = {
      teamNames,
      currentIndex,
      scores,
      scoredQuestions,
      revealed,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(toSave));
  }, [teamNames, currentIndex, scores, scoredQuestions, revealed]);

  const triggerFlash = (team: TeamName) => {
    setScoreFlash(team);
    setTimeout(() => setScoreFlash(null), 600);
  };

  const navigateToResults = useCallback(
    (finalScores: Scores) => {
      sessionStorage.removeItem(SESSION_KEY);
      navigate('/results', { state: { teamNames, scores: finalScores } });
    },
    [teamNames, navigate],
  );

  const advanceQuestion = useCallback(
    (newScores?: Scores) => {
      const finalScores = newScores ?? scores;
      if (currentIndex >= questions.length - 1) {
        navigateToResults(finalScores);
        return;
      }
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
      setAwaitingTeam(false);
    },
    [currentIndex, scores, navigateToResults],
  );

  // Called when "Next" button is clicked — ask which team gets the point
  const requestNext = useCallback(() => {
    setAwaitingTeam(true);
  }, []);

  // Called when team is selected after clicking Next (awards point + advances)
  const handleTeamSelect = useCallback(
    (team: TeamName) => {
      const newScores: Scores = {
        teamA: team === 'A' ? scores.teamA + 1 : scores.teamA,
        teamB: team === 'B' ? scores.teamB + 1 : scores.teamB,
      };
      setScores(newScores);
      setScoredQuestions((prev) => ({ ...prev, [currentIndex]: team }));
      triggerFlash(team);
      advanceQuestion(newScores);
    },
    [scores, currentIndex, advanceQuestion],
  );

  // Called when user changes an already-awarded answer (stays on same question)
  const handleChangeAnswer = useCallback(
    (newTeam: TeamName) => {
      const oldTeam = scoredQuestions[currentIndex];
      if (oldTeam === newTeam) return; // no change needed
      const newScores: Scores = {
        teamA:
          newTeam === 'A'
            ? scores.teamA + 1
            : oldTeam === 'A'
              ? scores.teamA - 1
              : scores.teamA,
        teamB:
          newTeam === 'B'
            ? scores.teamB + 1
            : oldTeam === 'B'
              ? scores.teamB - 1
              : scores.teamB,
      };
      setScores(newScores);
      setScoredQuestions((prev) => ({ ...prev, [currentIndex]: newTeam }));
      triggerFlash(newTeam);
    },
    [scores, currentIndex, scoredQuestions],
  );

  const handleSkip = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      navigateToResults(scores);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setRevealed(false);
    setAwaitingTeam(false);
  }, [currentIndex, scores, navigateToResults]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setRevealed(false);
    setAwaitingTeam(false);
  }, [currentIndex]);

  // Bottom-nav Next: just advance (skip) if question already scored
  const handleBottomNavNext = useCallback(() => {
    if (scoredQuestions[currentIndex] !== undefined) {
      handleSkip();
    } else {
      requestNext();
    }
  }, [currentIndex, scoredQuestions, handleSkip, requestNext]);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      <Scoreboard
        teamAName={teamNames.teamA}
        teamBName={teamNames.teamB}
        scores={scores}
        scoreFlash={scoreFlash}
      />

      <div className="quiz-main">
        <QuestionCard
          question={currentQuestion}
          revealed={revealed}
          awaitingTeam={awaitingTeam}
          teamAName={teamNames.teamA}
          teamBName={teamNames.teamB}
          scoredBy={scoredQuestions[currentIndex]}
          onNext={requestNext}
          onSkip={handleSkip}
          onReveal={handleReveal}
          onTeamSelect={handleTeamSelect}
          onChangeAnswer={handleChangeAnswer}
        />
      </div>

      <BottomNav
        currentIndex={currentIndex}
        total={questions.length}
        onPrev={handlePrev}
        onNext={handleBottomNavNext}
        awaitingTeam={awaitingTeam}
      />
    </div>
  );
}
