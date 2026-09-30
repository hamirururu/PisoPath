function detailOf(expense) {
  return Array.isArray(expense.transportation_details)
    ? expense.transportation_details[0]
    : expense.transportation_details;
}

function escapeCsv(value) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function expensesToCsv(rows) {
  const header = ["Date", "Time", "Category", "Description", "Store / Route", "Amount (PHP)", "Notes"];
  const lines = [header.join(",")];

  for (const row of rows) {
    let description = row.expense_name;
    let storeOrRoute = row.store_name || "";
    if (row.category === "Transportation") {
      const d = detailOf(row);
      description = d?.transportation_type || row.expense_name;
      storeOrRoute = d ? `${d.starting_point} -> ${d.destination}` : "";
    }
    lines.push(
      [
        row.expense_date,
        row.expense_time,
        row.category,
        description,
        storeOrRoute,
        Number(row.amount).toFixed(2),
        row.notes || "",
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function downloadCsv(csvText, filename) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}