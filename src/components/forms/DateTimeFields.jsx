import TextField from "../ui/TextField";

export default function DateTimeFields({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TextField type="date" label="Date" value={date} onChange={onDateChange} required />
      <TextField type="time" label="Time" value={time} onChange={onTimeChange} required />
    </div>
  );
}