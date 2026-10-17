import { Flame, Trophy } from "lucide-react";
import Card from "../ui/Card";
import { usePetStreak } from "../../hooks/usePetStreak";

const STAGES = [
  { name: "Egg", min: 0 },
  { name: "Hatchling", min: 1 },
  { name: "Buddy", min: 7 },
  { name: "Champ", min: 21 },
  { name: "Legend", min: 50 },
];
const GOALS = [3, 7, 14, 30, 60, 100];

const stageIndex = (days) => STAGES.reduce((acc, s, i) => (days >= s.min ? i : acc), 0);

function Pet({ stage, mood }) {
  if (stage === 0) {
    return (
      <svg viewBox="0 0 120 120" className="pp-float size-28" role="img" aria-label="Pesito's egg">
        <ellipse cx="60" cy="66" rx="32" ry="40" fill="#8E977D" stroke="#8A7650" strokeWidth="4" />
        <circle cx="48" cy="56" r="5" fill="#ECE7D1" opacity=".8" />
        <circle cx="72" cy="76" r="6" fill="#ECE7D1" opacity=".8" />
        <circle cx="58" cy="90" r="4" fill="#ECE7D1" opacity=".8" />
      </svg>
    );
  }

  const r = 26 + stage * 4;
  const sleepy = mood === "sleepy";
  const hungry = mood === "hungry";

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${sleepy ? "" : "pp-float"} size-28`}
      role="img"
      aria-label={`Pesito the ${STAGES[stage].name}, feeling ${mood}`}
    >
      {stage >= 4 && (
        <polygon points="44,24 48,10 56,18 60,8 64,18 72,10 76,24" fill="#8E977D" stroke="#8A7650" strokeWidth="3" strokeLinejoin="round" />
      )}
      <circle cx="60" cy="64" r={r} fill="#DBCEA5" stroke="#8A7650" strokeWidth="4" />
      <circle cx="60" cy="64" r={r - 7} fill="none" stroke="#8A7650" strokeWidth="2" opacity=".3" />
      <text x="60" y="50" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8A7650" opacity=".6">₱</text>

      {/* eyes */}
      {mood === "happy" && (
        <>
          <path d="M43 62 q5 -6 10 0" fill="none" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />
          <path d="M67 62 q5 -6 10 0" fill="none" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="72" r="5" fill="#8E977D" opacity=".5" />
          <circle cx="80" cy="72" r="5" fill="#8E977D" opacity=".5" />
        </>
      )}
      {hungry && (
        <>
          <circle cx="48" cy="62" r="3.5" fill="#3B3223" />
          <circle cx="72" cy="62" r="3.5" fill="#3B3223" />
        </>
      )}
      {sleepy && (
        <>
          <path d="M43 62 h10" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />
          <path d="M67 62 h10" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />
          <text x="90" y="40" fontSize="14" fontWeight="700" fill="#8A7650">z</text>
          <text x="98" y="30" fontSize="10" fontWeight="700" fill="#8A7650">z</text>
        </>
      )}

      {/* mouth */}
      {mood === "happy" && <path d="M52 75 q8 9 16 0" fill="none" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />}
      {hungry && <ellipse cx="60" cy="78" rx="3.5" ry="4.5" fill="#3B3223" />}
      {sleepy && <path d="M54 78 h12" stroke="#3B3223" strokeWidth="3" strokeLinecap="round" />}

      {stage >= 3 && mood !== "sleepy" && (
        <>
          <text x="14" y="30" fontSize="14" fill="#8A7650">✦</text>
          <text x="100" y="94" fontSize="11" fill="#8A7650">✦</text>
        </>
      )}
    </svg>
  );
}

export default function PetCard() {
  const { loading, error, streak } = usePetStreak();

  if (loading) return <div className="h-40 animate-pulse rounded-3xl bg-beige/40" aria-hidden="true" />;
  if (error || !streak) return null; // the pet is a bonus: never block the dashboard

  const { current, longest, totalDays, loggedToday } = streak;
  const stage = stageIndex(totalDays);
  const next = STAGES[stage + 1];
  const mood = totalDays === 0 ? "egg" : loggedToday ? "happy" : current > 0 ? "hungry" : "sleepy";
  const progress = next ? Math.round(((totalDays - STAGES[stage].min) / (next.min - STAGES[stage].min)) * 100) : 100;
  const goal = GOALS.find((g) => g > current);

  const message = {
    egg: "Log your first expense to hatch me!",
    happy: `Yum! Thanks for logging today. I'm feeling great.`,
    hungry: `I'm hungry! Log an expense today to keep your ${current}-day streak going.`,
    sleepy: "I fell asleep while you were away. Log an expense to wake me up!",
  }[mood];

  return (
    <Card className="flex items-center gap-4">
      <Pet stage={stage} mood={mood} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">Pesito <span className="font-normal text-earth-dark">· {STAGES[stage].name}</span></p>
          <span className="flex items-center gap-1 rounded-full bg-beige/60 px-2.5 py-0.5 text-xs font-semibold">
            <Flame size={13} className={current > 0 ? "text-earth" : "text-earth-dark/50"} />
            {current} day{current === 1 ? "" : "s"}
          </span>
        </div>

        <p className="text-sm text-earth-dark" aria-live="polite">{message}</p>

        {next ? (
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-beige/50" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress to ${next.name}`}>
              <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-earth-dark">{next.min - totalDays} more day{next.min - totalDays === 1 ? "" : "s"} logged to become a {next.name}</p>
          </div>
        ) : (
          <p className="flex items-center gap-1 text-xs font-medium text-earth-dark"><Trophy size={13} /> Fully grown!</p>
        )}

        <p className="text-xs text-earth-dark">
          Best streak: {longest} · Days logged: {totalDays}
          {goal && current > 0 ? ` · Next goal: ${goal} days` : ""}
        </p>
      </div>
    </Card>
  );
}