"use client";

import { ArrowLeftFromLine, ArrowRightFromLine, MessageSquare, Users } from "lucide-react";

import { Hint } from "../hint";
import { Button } from "../ui/button";
import { ChatVarient, useChatSidebar } from "@/store/use-chat-sidebar";

export const VariantToggle = () => {
    const {
        variant,
        onChangeVariant
    } = useChatSidebar((state) => state);

    const isChat = variant === ChatVarient.CHAT;

    const Icon = isChat ? Users : MessageSquare;

    const onToggle = () => {
        const newVariant = isChat ? ChatVarient.COMMUNITY : ChatVarient.CHAT;
        onChangeVariant(newVariant);
    }

    const label = isChat ? "Community" : "Go back to Chat";

    return (
        <Hint label={label} side='left' asChild>
            <Button
                onClick={onToggle}
                variant="ghost"
                className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
            >
                <Icon className="h-4 w-4"/>
            </Button>
        </Hint>
    )
}
