import SplashScreen from "./SplashScreen";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function FullScreenLoader() {
  const online = useOnlineStatus();
  return <SplashScreen message={online ? "Loading your expenses…" : "Waiting for a connection…"} />;
}