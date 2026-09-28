import { Hammer } from "lucide-react";
import Card from "./Card";

export default function PlaceholderPage({ title, stage }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sage/30 text-earth-dark">
          <Hammer size={22} />
        </span>
        <p className="text-sm text-earth-dark">
          This page will be built in <strong>Stage {stage}</strong>.
        </p>
      </Card>
    </section>
  );
}