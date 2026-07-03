"use client";

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

interface ContainerProps {
    children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
    const { collapsed, onCollapse, onExpand } = useCreatorSidebar((state) => state);
    const isMobile = useMediaQuery("(max-width: 1024px)");

    useEffect(() => {
        if (isMobile) {
            onCollapse();
        } else {
            onExpand();
        }
    }, [isMobile, onCollapse, onExpand]);

    return (
        <div className={cn("flex-1", collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60")}>
            {children}
        </div>
    );
}
