import { ArrowLeft, LoaderCircle } from "lucide-react";
import Button from "../ui/Button";

export default function FormShell({ title, onBack, onSubmit, submitting, children }) {
  return (
    <section className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="grid size-9 place-items-center rounded-xl text-earth-dark hover:bg-beige/50"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <div className="sticky bottom-20 z-10 pt-2 lg:static lg:bottom-auto">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <LoaderCircle size={18} className="animate-spin" />}
            {submitting ? "Saving…" : "Save Expense"}
          </Button>
        </div>
      </form>
    </section>
  );
}