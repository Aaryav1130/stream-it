import { create } from "zustand";

export enum ChatVarient {
    CHAT = "CHAT",
    COMMUNITY = "COMMUNITY"
}

interface ChatSidebarStore {
    collapsed: boolean;
    variant: ChatVarient;
    onExpand: () => void;
    onCollapse: () => void;
    onChangeVariant: (variant: ChatVarient) => void;
};

export const useChatSidebar = create<ChatSidebarStore>((set) => ({
    collapsed: false,
    variant: ChatVarient.CHAT,
    onExpand: () => set({ collapsed: false }),
    onCollapse: () => set({ collapsed: true }),
    onChangeVariant: (variant: ChatVarient) => set(()=>({variant}))
}));
