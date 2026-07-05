"use client";

import { VerifiedMark } from "../verified-mark";
import { BioModal } from "./bio-modal";

interface AboutCardProps {
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    bio: string | null;
    followersCount: number;
}

export const AboutCard = ({
    hostName,
    hostIdentity,
    viewerIdentity,
    bio,
    followersCount
}: AboutCardProps) => {

    const hostAsViewer = `host-${hostIdentity}`;
    const isHost = hostAsViewer === viewerIdentity;

    const followersLabel = followersCount === 1 ? "follower" : "followers";
    return (
        <div className="px-4">
            <div className="group rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
                        About {hostName}
                        <VerifiedMark/>
                    </div>
                    {isHost && (
                        <BioModal
                            intialValue={bio}
                        />
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{followersCount}</span> {followersLabel}
                </div>
                <p className="text-sm">
                    {bio || "No bio provided."}
                </p>
            </div>
        </div>
    );
}
