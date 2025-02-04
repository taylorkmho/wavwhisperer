import { Button } from "@/components/ui/button";
import { useVotes } from "@/hooks/useVotes";
import { FaThumbsUp } from "react-icons/fa6";
import { toast } from "sonner";

interface VoteButtonsProps {
  surfReportId: string;
}

export function VoteButtons({ surfReportId }: VoteButtonsProps) {
  const { voteCounts, castVote } = useVotes(surfReportId);

  const handleVote = async () => {
    try {
      await castVote();
      toast("Vote recorded!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleVote}
      className="flex items-center gap-2"
    >
      <FaThumbsUp />
      <span>{voteCounts.upvotes}</span>
    </Button>
  );
}
