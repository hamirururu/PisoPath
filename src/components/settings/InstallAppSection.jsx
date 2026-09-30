import toast from "react-hot-toast";
import { Download, Share, Smartphone } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Button from "../ui/Button";
import { usePwaInstall } from "../../hooks/usePwaInstall";

export default function InstallAppSection() {
  const { canInstall, isIOS, installed, promptInstall } = usePwaInstall();

  async function handleInstall() {
    const outcome = await promptInstall();
    if (outcome === "accepted") toast.success("Installing PisoPath…");
    else if (outcome === "dismissed") toast("Install dismissed.", { icon: "👋" });
  }

  if (installed) {
    return (
      <SettingsSection title="PisoPath app" description="You are already using the installed app.">
        <p className="flex items-center gap-2 text-sm text-earth-dark">
          <Smartphone size={16} /> Installed and running in standalone mode.
        </p>
      </SettingsSection>
    );
  }

  // iOS never fires beforeinstallprompt, so the button cannot trigger anything —
  // it has to point at Share → Add to Home Screen instead.
  if (isIOS) {
    return (
      <SettingsSection
        title="Install PisoPath"
        description="Add PisoPath to your Home Screen for a full-screen, offline-capable app."
      >
        <ol className="flex items-center gap-2 text-sm text-earth-dark">
          <li className="flex items-center gap-1.5">
            Tap <Share size={15} /> Share
          </li>
          <li aria-hidden="true">→</li>
          <li>Add to Home Screen</li>
        </ol>
      </SettingsSection>
    );
  }

  if (!canInstall) {
    return (
      <SettingsSection
        title="Install PisoPath"
        description="PisoPath can be installed for offline use and a full-screen window."
      >
        <p className="text-sm text-earth-dark">
          Not available yet. Chrome offers the install option once you have visited the
          site a few times and run it from the address bar rather than a bookmark. You
          can also install it now from the address-bar icon.
        </p>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Install PisoPath"
      description="Run PisoPath in its own window, with offline support."
    >
      <Button variant="soft" onClick={handleInstall}>
        <Download size={16} /> Install app
      </Button>
    </SettingsSection>
  );
}