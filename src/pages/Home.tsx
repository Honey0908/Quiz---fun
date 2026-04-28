import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { QuizLocationState } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');

  const handleStart = () => {
    sessionStorage.removeItem('ai-quiz-state');
    const state: QuizLocationState = {
      teamNames: {
        teamA: teamAName.trim() || 'Team A',
        teamB: teamBName.trim() || 'Team B',
      },
    };
    navigate('/quiz', { state });
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-emoji-header">🧠</div>
        <h1 className="home-title">Team Quiz!</h1>
        <p className="home-subtitle">
          Two teams. One winner. Let the battle begin! ⚔️
        </p>

        <div className="team-inputs">
          <div className="team-input-group team-a-group">
            <label className="team-input-label">🔥 Team A Name</label>
            <input
              className="team-input team-a-input"
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="Team A 🔥"
              maxLength={20}
            />
          </div>

          <div className="vs-badge">VS</div>

          <div className="team-input-group team-b-group">
            <label className="team-input-label">⚡ Team B Name</label>
            <input
              className="team-input team-b-input"
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="Team B ⚡"
              maxLength={20}
            />
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          🚀 Start Quiz!
        </button>

        <p className="home-hint">
          15 questions · 2 teams · infinite bragging rights 🏆
        </p>

        <Link to="/admin" className="admin-link">
          ⚙️ Manage Questions
        </Link>
      </div>
    </div>
  );
}
