import { useState } from "react";
import { buildPresetRanges } from "../../lib/reportRanges";
import { todayISO } from "../../utils/dates";
import TextField from "../ui/TextField";
import Button from "../ui/Button";

export default function RangeFilter({ range, onChange }) {
  const presets = buildPresetRanges();
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(range.start);
  const [customEnd, setCustomEnd] = useState(range.end);

  function applyCustom() {
    if (!customStart || !customEnd || customStart > customEnd) return;
    onChange({ key: "custom", label: "Custom range", start: customStart, end: customEnd });
    setCustomOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setCustomOpen(false);
              onChange(p);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              range.key === p.key ? "bg-earth text-cream" : "bg-beige/50 text-ink hover:bg-beige"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setCustomOpen((v) => !v)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            range.key === "custom" ? "bg-earth text-cream" : "bg-beige/50 text-ink hover:bg-beige"
          }`}
        >
          Custom
        </button>
      </div>

      {customOpen && (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-paper p-4 ring-1 ring-beige/70">
          <TextField
            label="From"
            type="date"
            max={todayISO()}
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <TextField
            label="To"
            type="date"
            max={todayISO()}
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <Button onClick={applyCustom}>Apply</Button>
        </div>
      )}
    </div>
  );
}