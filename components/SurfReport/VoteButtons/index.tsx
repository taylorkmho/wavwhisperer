import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVotes } from "@/hooks/useVotes";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";

import { toast } from "sonner";

interface VoteButtonsProps {
  surfReportId: string;
}

const DEBOUNCE_DURATION = 1000;

export function VoteButtons({ surfReportId }: VoteButtonsProps) {
  const { voteCounts, castVote } = useVotes(surfReportId);
  const [pendingVotes, setPendingVotes] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pendingVotesRef = useRef(0);

  const sendVotes = useCallback(async () => {
    console.log("sendVotes called with pendingVotes:", pendingVotesRef.current);

    if (pendingVotesRef.current > 0) {
      try {
        await castVote(pendingVotesRef.current);
        updatePendingVotes(0);
      } catch (error) {
        console.error("Error in sendVotes:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    } else {
      console.log("No pending votes to send");
    }
  }, [castVote]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePendingVotes = (newValue: number) => {
    setPendingVotes(newValue);
    pendingVotesRef.current = newValue;
  };

  const handleVote = () => {
    updatePendingVotes(pendingVotesRef.current + 1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(sendVotes, DEBOUNCE_DURATION);
  };

  return (
    <TooltipProvider>
      <Tooltip open={pendingVotes > 0}>
        <TooltipTrigger>
          <button
            onClick={handleVote}
            className="px-2 transition-transform hover:scale-125 active:scale-100"
          >
            <FaHandsClapping className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-center">
          <h4 className="text-lg font-bold">{voteCounts.upvotes}</h4>
          {pendingVotes > 0 && `+${pendingVotes}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
