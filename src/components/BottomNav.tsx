interface BottomNavProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  awaitingTeam: boolean;
}

export default function BottomNav({
  currentIndex,
  total,
  onPrev,
  onNext,
  awaitingTeam,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className="nav-btn nav-prev"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        ← Prev
      </button>

      <span className="question-counter">
        {currentIndex + 1} / {total}
      </span>

      <button
        className="nav-btn nav-next"
        onClick={onNext}
        disabled={awaitingTeam}
      >
        Next →
      </button>
    </nav>
  );
}
