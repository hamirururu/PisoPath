import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import CategoryManager from "../components/settings/CategoryManager";
import ExportSection from "../components/settings/ExportSection";
import InstallAppSection from "../components/settings/InstallAppSection";
import DangerZone from "../components/settings/DangerZone";

export default function Settings() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileSection />
        <PreferencesSection />
        <CategoryManager />
        <ExportSection />
        <InstallAppSection />
      </div>
      <DangerZone />
    </section>
  );
}