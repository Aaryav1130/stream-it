import Image from "next/image";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ['latin'],
    weight: ['200', '400', '600', '700'],
})

export const Logo = () => {
    

    return (
        <Link href='/'>
            <div className="flex items-center gap-x-4 hover:opacity-75 transition">
                <div className="bg-red-600 rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
                    <Image
                        src="/smooth.svg"
                        alt="Smooth Logo"
                        width={32}
                        height={32}
                    />
                </div>
                <div className={cn(
                    "hidden lg:flex flex-col gap-y-1 text-primary-foreground",
                    font.className)}>
                    <p className="text-lg font-semibold">Stream It</p>
                    <p className="text-xs text-muted-foreground">
                        Let&apos;s watch something
                    </p>
                </div>
            </div>
        </Link>
    );
};
