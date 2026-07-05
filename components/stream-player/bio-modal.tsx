"use client"

import { useState, useTransition, useRef, ElementRef } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

interface BioModalProps {
    intialValue: string | null;
}

export const BioModal = ({
    intialValue
}: BioModalProps) => {
    const [value, setValue] = useState(intialValue);
    const [isPending, startTransition] = useTransition();
    const closeRef = useRef<ElementRef<"button">>(null);

    const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            updateUser({bio: value})
            .then(()=> {
                toast.success("Bio updated successfully");
                closeRef.current?.click();
            })
            .catch((error) => {
                toast.error(error.message);
            });
        });
    }
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="link" size="sm" className="ml-auto">
                    Edit Bio
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit User Bio
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea
                        placeholder="Write a bio..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value || ""}
                        disabled={isPending}
                        className="resize-none"
                    />
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit"
                        disabled={isPending} variant="primary">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
