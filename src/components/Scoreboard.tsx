import type { Scores, TeamName } from '../types';

interface ScoreboardProps {
  teamAName: string;
  teamBName: string;
  scores: Scores;
  scoreFlash: TeamName | null;
}

export default function Scoreboard({
  teamAName,
  teamBName,
  scores,
  scoreFlash,
}: ScoreboardProps) {
  return (
    <header className="scoreboard">
      <div
        className={`score-panel score-panel-a ${scoreFlash === 'A' ? 'score-bump' : ''}`}
      >
        <span className="score-team-label">🔥 {teamAName}</span>
        <span className="score-value">{scores.teamA}</span>
      </div>

      <div className="scoreboard-crown">🏆</div>

      <div
        className={`score-panel score-panel-b ${scoreFlash === 'B' ? 'score-bump' : ''}`}
      >
        <span className="score-value">{scores.teamB}</span>
        <span className="score-team-label">{teamBName} ⚡</span>
      </div>
    </header>
  );
}
