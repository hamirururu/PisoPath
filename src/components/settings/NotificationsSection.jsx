import { useState } from "react";
import toast from "react-hot-toast";
import { Bell, BellOff } from "lucide-react";
import SettingsSection from "./SettingsSection";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { disable, isEnabled, notificationsSupported, sendTest, setBaseline } from "../../lib/spendingNotifications";

export default function NotificationsSection() {
  const { user } = useAuth();
  const [on, setOn] = useState(() => isEnabled(user.id));
  const supported = notificationsSupported();
  const denied = supported && Notification.permission === "denied";

  async function turnOn() {
    const result = await Notification.requestPermission(); // must come from a tap
    if (result !== "granted") {
      toast.error("Notification permission was not granted.");
      return;
    }
    setBaseline(user.id);
    setOn(true);
    await sendTest().catch(() => {});
    window.dispatchEvent(new Event("pisopath:notify-changed"));
    toast.success("Spending notifications enabled.");
  }

  function turnOff() {
    disable(user.id);
    setOn(false);
    toast.success("Spending notifications turned off.");
  }

  return (
    <SettingsSection
      title="Spending notifications"
      description="A summary at 11:59 PM (your device time) each day, and another at the end of each month."
    >
      {!supported ? (
        <p className="text-sm text-earth-dark">This browser doesn't support notifications. On iPhone, install PisoPath to your Home Screen first (iOS 16.4 or later).</p>
      ) : denied ? (
        <p className="text-sm text-danger">Notifications are blocked. Allow them for this site in your browser or phone settings, then come back.</p>
      ) : on ? (
        <Button variant="soft" onClick={turnOff}><BellOff size={16} /> Turn off</Button>
      ) : (
        <Button onClick={turnOn}><Bell size={16} /> Turn on notifications</Button>
      )}
      <p className="text-xs text-earth-dark">This setting applies to this device only.</p>
    </SettingsSection>
  );
}