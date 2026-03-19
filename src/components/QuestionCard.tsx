import { useState } from 'react';
import type { Question, TeamName } from '../types';
import TeamSelect from './TeamSelect';

interface QuestionCardProps {
  question: Question;
  revealed: boolean;
  awaitingTeam: boolean;
  teamAName: string;
  teamBName: string;
  scoredBy?: TeamName;
  onNext: () => void;
  onSkip: () => void;
  onReveal: () => void;
  onTeamSelect: (team: TeamName) => void;
  onChangeAnswer: (team: TeamName) => void;
}

export default function QuestionCard({
  question,
  revealed,
  awaitingTeam,
  teamAName,
  teamBName,
  scoredBy,
  onNext,
  onSkip,
  onReveal,
  onTeamSelect,
  onChangeAnswer,
}: QuestionCardProps) {
  const [changingAnswer, setChangingAnswer] = useState(false);

  const handleChangeSelect = (team: TeamName) => {
    onChangeAnswer(team);
    setChangingAnswer(false);
  };

  return (
    <div className="question-card">
      <div className="question-badge-row">
        <div className="question-badge">Q {question.id}</div>
        {scoredBy && (
          <div
            className={`scored-badge scored-badge-${scoredBy.toLowerCase()}`}
          >
            {scoredBy === 'A'
              ? `🔥 Point: ${teamAName}`
              : `⚡ Point: ${teamBName}`}
          </div>
        )}
      </div>

      <p className="question-text">{question.question}</p>

      {revealed && (
        <div className="answer-block">
          <div className="answer-label">✅ Answer</div>
          <div className="answer-text">{question.answer}</div>
          <div className="explanation-text">💡 {question.explanation}</div>
        </div>
      )}

      <div className="card-actions">
        {awaitingTeam ? (
          <TeamSelect
            teamAName={teamAName}
            teamBName={teamBName}
            onSelect={onTeamSelect}
          />
        ) : changingAnswer ? (
          <>
            <p className="change-answer-hint">🔄 Select the correct team</p>
            <TeamSelect
              teamAName={teamAName}
              teamBName={teamBName}
              onSelect={handleChangeSelect}
            />
            <button
              className="btn-cancel-change"
              onClick={() => setChangingAnswer(false)}
            >
              ✖ Cancel
            </button>
          </>
        ) : (
          <div className="action-buttons">
            {scoredBy ? (
              <div
                className={`already-scored-notice already-scored-${scoredBy.toLowerCase()}`}
              >
                <span>
                  ✅ {scoredBy === 'A' ? `🔥 ${teamAName}` : `⚡ ${teamBName}`}
                </span>
                <button
                  className="btn-change-answer"
                  onClick={() => setChangingAnswer(true)}
                >
                  🔄 Change
                </button>
              </div>
            ) : (
              <button className="action-btn btn-next" onClick={onNext}>
                ✅ Next
              </button>
            )}
            <button className="action-btn btn-skip" onClick={onSkip}>
              ⏭️ Skip
            </button>
            <button
              className={`action-btn btn-reveal ${revealed ? 'btn-reveal-active' : ''}`}
              onClick={onReveal}
              disabled={revealed}
            >
              🔍 Reveal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
