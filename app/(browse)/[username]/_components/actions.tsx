"use client";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { onBlock, onUnblock } from "@/actions/block";

interface ActionsProps {
    isFollowing: boolean;
    isBlocked: boolean;
    userId: string;

}

export const Actions = ({
    isFollowing,
    isBlocked,
    userId
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
            .then((data)=> toast.success(`Followed user ${data!.following.username}`)) // Add type assertion 'data!'
            .catch(()=> toast.error("Failed to follow user"));
        })
    }

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
            .then((data)=> toast.success(`Unfollowed user ${data!.following.username}`)) // Add type assertion 'data!'
            .catch(()=> toast.error("Failed to follow user"));
        })
    }

    const onClick = isFollowing ? handleUnfollow : handleFollow;


    const handleBlock = () => {
        startTransition(() => {
            onBlock(userId)
            .then((data)=> toast.success(`Blocked user ${data!.blocked.username}`))
            .catch(()=> toast.error("Failed to block user"));
        })
    }

    const handleUnblock = () => {
        startTransition(() => {
            onUnblock(userId)
            .then((data)=> toast.success(`Unblocked user ${data!.blocked.username}`))
            .catch(()=> toast.error("Failed to unblock user"));
        })
    }

    const onClick1 = isBlocked ? handleUnblock : handleBlock;
    return (
        <div>
            <Button disabled={isPending} onClick={onClick} variant="primary" className="gap-3">
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button 
                onClick={onClick1}
                disabled={isPending}
                variant="ghost"
                className="ml-2 gap-3"
            >
                {isBlocked ? "Unblock" : "Block"}
            </Button>
        </div>
    );
}
