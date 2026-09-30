import { useState } from "react";
import toast from "react-hot-toast";
import { Download, LoaderCircle } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Button from "../ui/Button";
import { fetchAllExpensesFull } from "../../services/expenseService";
import { expensesToCsv, downloadCsv } from "../../utils/csv";

export default function ExportSection() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    try {
      const rows = await fetchAllExpensesFull();
      if (rows.length === 0) {
        toast.error("You have no expenses to export yet.");
        return;
      }
      const csv = expensesToCsv(rows);
      const today = new Date().toISOString().slice(0, 10);
      downloadCsv(csv, `pisopath-expenses-${today}.csv`);
      toast.success("CSV exported.");
    } catch (err) {
      toast.error(err.message || "Could not export your expenses.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <SettingsSection title="Export data" description="Download your full expense history as a CSV file.">
      <Button variant="soft" onClick={handleExport} disabled={exporting}>
        {exporting ? <LoaderCircle size={16} className="animate-spin" /> : <Download size={16} />}
        {exporting ? "Preparing…" : "Export to CSV"}
      </Button>
    </SettingsSection>
  );
}