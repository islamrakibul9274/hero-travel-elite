"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster, toast } from "sonner";
import { getPusherClient } from "@/lib/pusher";
import { Sparkles, MapPin, CheckCircle2 } from "lucide-react";

interface LiveActivity {
  type: string;
  title: string;
  time: string;
  location: string;
}

interface ActivityContextType {
  latestActivity: LiveActivity | null;
  activityList: LiveActivity[];
}

const ActivityContext = createContext<ActivityContextType>({
  latestActivity: null,
  activityList: [],
});

export const useLiveActivity = () => useContext(ActivityContext);

function PusherRealtimeListener({ children }: { children: React.ReactNode }) {
  const [latestActivity, setLatestActivity] = useState<LiveActivity | null>({
    type: "booking",
    title: "Sophia from London reserved Amalfi Coast Escape",
    time: "2 mins ago",
    location: "Amalfi, Italy",
  });

  const [activityList, setActivityList] = useState<LiveActivity[]>([
    {
      type: "booking",
      title: "Sophia from London reserved Amalfi Coast Escape",
      time: "2 mins ago",
      location: "Amalfi, Italy",
    },
    {
      type: "membership",
      title: "David from Singapore upgraded to Black Card Elite",
      time: "14 mins ago",
      location: "VIP Member",
    },
    {
      type: "booking",
      title: "Elena from Geneva booked Swiss Alps Panorama",
      time: "28 mins ago",
      location: "Zermatt, Switzerland",
    },
  ]);

  useEffect(() => {
    try {
      const pusher = getPusherClient();
      const channel = pusher.subscribe("hero-travel-channel");

      channel.bind("new-activity", (data: LiveActivity) => {
        setLatestActivity(data);
        setActivityList((prev) => [data, ...prev.slice(0, 9)]);

        // Display subtle toast notification
        toast.custom(
          (t) => (
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-3.5 max-w-sm text-slate-800 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0">
                {data.type === "membership" ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{data.title}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {data.location} • {data.time}
                </p>
              </div>
            </div>
          ),
          { duration: 4500 }
        );
      });

      return () => {
        pusher.unsubscribe("hero-travel-channel");
      };
    } catch (e) {
      console.warn("Pusher client listener initialized with offline mode");
    }
  }, []);

  return (
    <ActivityContext.Provider value={{ latestActivity, activityList }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PusherRealtimeListener>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </PusherRealtimeListener>
    </SessionProvider>
  );
}
