import { useNavigate, useLocation } from 'react-router-dom';
import type { ResultsLocationState } from '../types';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  const teamNames = state?.teamNames ?? { teamA: 'Team A', teamB: 'Team B' };
  const scores = state?.scores ?? { teamA: 0, teamB: 0 };

  const isDraw = scores.teamA === scores.teamB;
  const winnerName =
    scores.teamA > scores.teamB ? teamNames.teamA : teamNames.teamB;
  const winnerClass = scores.teamA > scores.teamB ? 'team-a' : 'team-b';

  return (
    <div className="results-container">
      <div className="results-card">
        {isDraw ? (
          <>
            <div className="results-emoji">🤝</div>
            <h1 className="results-title">It's a Draw!</h1>
            <p className="results-subtitle">
              What a match! Both teams are legends! 🌟
            </p>
          </>
        ) : (
          <>
            <div className="results-emoji">🎉</div>
            <h1 className={`results-title winner-title ${winnerClass}-winner`}>
              {winnerName} Wins!
            </h1>
            <p className="results-subtitle">
              Absolute champions! Take a bow! 🏆👑
            </p>
          </>
        )}

        <div className="score-table">
          <div
            className={`score-row ${scores.teamA > scores.teamB ? 'score-row-winner' : ''}`}
          >
            <span className="score-team-name">🔥 {teamNames.teamA}</span>
            <span className="score-final-value team-a-score">
              {scores.teamA}
            </span>
            {scores.teamA > scores.teamB && <span className="crown">👑</span>}
          </div>
          <div className="score-divider">VS</div>
          <div
            className={`score-row ${scores.teamB > scores.teamA ? 'score-row-winner' : ''}`}
          >
            <span className="score-team-name">⚡ {teamNames.teamB}</span>
            <span className="score-final-value team-b-score">
              {scores.teamB}
            </span>
            {scores.teamB > scores.teamA && <span className="crown">👑</span>}
          </div>
        </div>

        <button className="play-again-btn" onClick={() => navigate('/')}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
