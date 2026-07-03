"use client";

import { Button } from "@/components/ui/button";
import { createIngress } from "@/actions/ingress";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { 
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { IngressInput } from "livekit-server-sdk";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useState, useTransition, useRef, ElementRef } from "react";
import { toast } from "sonner";

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;


export const ConnectModel = () => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [ingressType, setIngressType] = useState<IngressType>(RTMP);
    const [isPending, startTransition] = useTransition();

    const onSubmit = () => {
        startTransition(() => {
            createIngress(parseInt(ingressType) as IngressInput)
                .then(() => {
                    toast.success("Connection generated");
                    closeRef?.current?.click();
                })
                .catch((error) => {
                    const message = error instanceof Error ? error.message : "Failed to generate connection";
                    toast.error(message);
                })
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">
                    Generate connection
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Generate connection
                    </DialogTitle>
                    <DialogClose/>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={(value) => setIngressType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert>
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        This action will reset all active streams using the current connection.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button onClick={()=>{}} variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={isPending} variant="primary">
                        Generate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
