import type { TeamName } from '../types';

interface TeamSelectProps {
  teamAName: string;
  teamBName: string;
  onSelect: (team: TeamName) => void;
}

export default function TeamSelect({
  teamAName,
  teamBName,
  onSelect,
}: TeamSelectProps) {
  return (
    <div className="team-select-overlay">
      <p className="team-select-heading">🎯 Who got it right?</p>
      <div className="team-select-buttons">
        <button
          className="team-select-btn team-select-a"
          onClick={() => onSelect('A')}
        >
          🔥 {teamAName}
        </button>
        <button
          className="team-select-btn team-select-b"
          onClick={() => onSelect('B')}
        >
          ⚡ {teamBName}
        </button>
      </div>
    </div>
  );
}
