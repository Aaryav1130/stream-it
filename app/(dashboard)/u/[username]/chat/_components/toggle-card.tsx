'use client';

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTransition } from "react";

import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";


type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
};

export const ToggleCard = ({label, value=false, field}: ToggleCardProps) => {
    const [isPending, startTransition] = useTransition();
    const onChange = ()=>{
        startTransition(()=>{
            updateStream({[field]: !value}).then(()=>{
                toast.success("Stream updated")
            }).catch(()=>{
                toast.error("Error updating stream")
            })
        })
    }

    return (
        <div className="bg-muted rounded-xl p-6">
            <div className="flex justify-between items-center">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="space-y-2">
                    <Switch
                        disabled={isPending}
                        onCheckedChange={onChange}
                        checked={value}
                    >
                        {value ? "Enabled" : "Disabled"}
                    </Switch>
                </div>
            </div>
        </div>
    )
};

export const ToggleCardSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full"/>
    )
}
