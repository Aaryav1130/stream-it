"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface ActionsProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
}

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost
}:ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {userId} = useAuth();

    const handleFollow = () => {
        onFollow(hostIdentity)
        .then((data)=> toast.success(`You are now following ${data?.following?.username}`))
        .catch(()=> toast.error("Failed to follow user"))
    }

    const handleUnfollow = () => {
        onUnfollow(hostIdentity)
        .then(()=> toast.success(`You have unfollowed this user`))
        .catch(()=> toast.error("Failed to unfollow user"))
    }

    const toggleFollow  = () => {
        if(!userId) {
            router.push("/sign-in");
            return;
        }

        if(isHost){
            return;
        }

        if(isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }
    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
        >
            <Heart
                className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}
            />
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    )
}

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24"/>
    )
}
