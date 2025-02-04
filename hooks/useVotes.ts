import { supabase } from "@/lib/supabase/client";
import { type Vote } from "@/types/votes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useVotes(surfReportId?: string) {
  const queryClient = useQueryClient();

  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["votes", surfReportId],
    queryFn: async () => {
      const query = supabase.from("votes").select("*");

      if (surfReportId) {
        query.eq("surf_report_id", surfReportId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const upvotes = votes?.length ?? 0;

  useEffect(() => {
    console.log(
      `Setting up realtime subscription ${surfReportId ? `for report ${surfReportId}` : "for all votes"}`
    );

    const channel = supabase
      .channel(`votes:${surfReportId || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          ...(surfReportId && { filter: `surf_report_id=eq.${surfReportId}` }),
        },
        (payload) => {
          console.log("Realtime vote update received:", payload);
          queryClient.invalidateQueries({
            queryKey: ["votes", surfReportId],
            exact: true,
            refetchType: "active",
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status:`, status);
      });

    return () => {
      console.log(`Cleaning up realtime subscription`);
      supabase.removeChannel(channel);
    };
  }, [surfReportId, queryClient]);

  const castVote = async (count: number = 1) => {
    if (!surfReportId)
      throw new Error("Cannot cast vote without surf report ID");

    console.log(`Casting ${count} upvotes for report ${surfReportId}`);

    // Optimistically update the query data
    queryClient.setQueryData(["votes", surfReportId], (old: Vote[] = []) => {
      const newVotes = Array(count).fill({
        id: "temp-id",
        surf_report_id: surfReportId,
        vote_type: "up",
        created_at: new Date().toISOString(),
      });
      return [...old, ...newVotes];
    });

    const votes = Array(count).fill({
      surf_report_id: surfReportId,
      vote_type: "up",
    });

    const { error } = await supabase.from("votes").insert(votes);

    if (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["votes", surfReportId] });
      console.error("Error inserting votes:", error);
      throw error;
    }
  };

  return {
    voteCounts: { upvotes },
    castVote,
  };
}
