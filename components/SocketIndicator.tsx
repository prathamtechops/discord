import { useSocket } from "./socket-provider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="destructive" className="border-none">
        Fallback: Polling ...
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="border-none bg-emerald-400">
      Live Updates
    </Badge>
  );
};

export default SocketIndicator;
