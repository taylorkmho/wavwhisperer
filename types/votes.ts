import { z } from "zod";

export const voteSchema = z.object({
  id: z.string().uuid(),
  surf_report_id: z.string().uuid(),
  vote_type: z.literal("up"),
  created_at: z.string(),
});

export const voteCountsSchema = z.object({
  upvotes: z.number(),
});

export type Vote = z.infer<typeof voteSchema>;
export type VoteCounts = z.infer<typeof voteCountsSchema>;
