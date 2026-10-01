import { Search } from "lucide-react";
import Select from "../ui/Select";
import { TRANSPORT_TYPES } from "../../lib/categories";

export default function TransportFilters({ search, onSearch, type, onType }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-dark" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search starting point or destination"
          className="w-full rounded-2xl bg-cream py-3 pl-10 pr-4 text-sm ring-1 ring-beige placeholder:text-earth-dark/50 focus:outline-none focus:ring-2 focus:ring-earth"
        />
      </div>
      <Select label="" value={type} onChange={(e) => onType(e.target.value)} className="sm:w-48">
        <option value="">All vehicle types</option>
        {TRANSPORT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>
    </div>
  );
}