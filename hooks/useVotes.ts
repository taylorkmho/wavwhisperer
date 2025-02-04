import { supabase } from "@/lib/supabase/client";
import { type Vote, type VoteCounts } from "@/types/votes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useVotes(surfReportId: string) {
  const queryClient = useQueryClient();
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({
    upvotes: 0,
    downvotes: 0,
  });

  // Query to fetch initial vote counts
  const { data: initialVotes } = useQuery<Vote[]>({
    queryKey: ["votes", surfReportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("surf_report_id", surfReportId);

      if (error) throw error;
      return data;
    },
  });

  // Update vote counts when initial data changes
  useEffect(() => {
    if (initialVotes) {
      const ups = initialVotes.filter((v) => v.vote_type === "up").length;
      const downs = initialVotes.filter((v) => v.vote_type === "down").length;
      setVoteCounts({ upvotes: ups, downvotes: downs });
    }
  }, [initialVotes]);

  // Set up realtime subscription
  useEffect(() => {
    console.log(`Setting up realtime subscription for report ${surfReportId}`);

    const channel = supabase
      .channel(`votes:${surfReportId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `surf_report_id=eq.${surfReportId}`,
        },
        (_payload) => {
          console.log("Realtime vote update received:", _payload);
          queryClient.invalidateQueries({ queryKey: ["votes", surfReportId] });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status:`, status);
      });

    return () => {
      console.log(
        `Cleaning up realtime subscription for report ${surfReportId}`
      );
      supabase.removeChannel(channel);
    };
  }, [surfReportId, queryClient]);

  // Function to cast a vote
  const castVote = async (type: "up" | "down") => {
    console.log(`Attempting to cast ${type} vote for report ${surfReportId}`);

    const { error } = await supabase.from("votes").insert({
      surf_report_id: surfReportId,
      vote_type: type,
    });

    if (error) {
      console.error("Error inserting vote:", error);
      throw error;
    }
  };

  return {
    voteCounts,
    castVote,
  };
}
