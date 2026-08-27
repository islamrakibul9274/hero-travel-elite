import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
  useTLS: true,
});

// Client-side Pusher singleton
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = (): PusherClient => {
  if (typeof window === "undefined") {
    throw new Error("PusherClient cannot be initialized on the server");
  }

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "3d2ada18a4e8a0ef2f4e",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
      }
    );
  }

  return pusherClientInstance;
};
