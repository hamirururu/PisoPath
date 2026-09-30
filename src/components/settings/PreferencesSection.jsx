import { useState } from "react";
import toast from "react-hot-toast";
import SettingsSection from "./SettingsSection";
import Select from "../ui/Select";
import TextField from "../ui/TextField";
import { useAuth } from "../../hooks/useAuth";
import { updateDateFormat } from "../../services/settingsService";

const FORMATS = [
  { value: "long", label: "September 28, 2026" },
  { value: "mdy", label: "09/28/2026 (MM/DD/YYYY)" },
  { value: "dmy", label: "28/09/2026 (DD/MM/YYYY)" },
];

export default function PreferencesSection() {
  const { user } = useAuth();
  const [format, setFormat] = useState(user?.user_metadata?.date_format || "long");

  async function handleChange(e) {
    const value = e.target.value;
    setFormat(value);
    try {
      await updateDateFormat(value);
      toast.success("Date format updated.");
    } catch (err) {
      toast.error(err.message || "Could not update your preference.");
    }
  }

  return (
    <SettingsSection
      title="Preferences"
      description="Applies to date labels in your Expense History and Reports."
    >
      <TextField label="Currency" value="Philippine Peso (₱)" disabled hint="PisoPath currently supports PHP only." />
      <Select label="Date format" value={format} onChange={handleChange}>
        {FORMATS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </Select>
    </SettingsSection>
  );
}