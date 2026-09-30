import Card from "../ui/Card";

export default function SettingsSection({ title, description, children }) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="text-xs text-earth-dark">{description}</p>}
      </div>
      {children}
    </Card>
  );
}