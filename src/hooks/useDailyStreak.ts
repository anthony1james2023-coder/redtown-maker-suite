import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDailyStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStreak(0);
      setLoading(false);
      return;
    }

    const recordAndCalcStreak = async () => {
      // Record today's visit (upsert)
      await supabase
        .from("daily_visits")
        .upsert(
          { user_id: user.id, visited_date: new Date().toISOString().split("T")[0] },
          { onConflict: "user_id,visited_date" }
        );

      // Fetch all visit dates ordered desc
      const { data } = await supabase
        .from("daily_visits")
        .select("visited_date")
        .eq("user_id", user.id)
        .order("visited_date", { ascending: false });

      if (!data || data.length === 0) {
        setStreak(1);
        setLoading(false);
        return;
      }

      // Calculate consecutive days streak
      let count = 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const firstDate = new Date(data[0].visited_date + "T00:00:00");
      const diffFromToday = Math.round((today.getTime() - firstDate.getTime()) / 86400000);
      
      // If most recent visit isn't today or yesterday, streak is 0
      if (diffFromToday > 1) {
        setStreak(0);
        setLoading(false);
        return;
      }

      for (let i = 1; i < data.length; i++) {
        const prev = new Date(data[i - 1].visited_date + "T00:00:00");
        const curr = new Date(data[i].visited_date + "T00:00:00");
        const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
        if (diff === 1) {
          count++;
        } else {
          break;
        }
      }

      setStreak(count);
      setLoading(false);
    };

    recordAndCalcStreak();
  }, [user]);

  return { streak, loading };
};
