import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ['400', '700'],
});

export const Logo = () => {
    const containerStyle = {
        background: 'linear-gradient(135deg, #9B1111, #FF1A1A)', // Gradient background from darker red to brighter red
        padding: '16px', // Padding around the logo
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Shadow for a subtle effect
        transition: 'transform 0.3s ease', // Smooth transition for hover effect
        borderRadius: '8px', // Rounded corners
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '32px', // Increase margin from the top
    };

    const hoverStyle = {
        transform: 'translateY(-2px)', // Lift the container on hover
    };

    return (
        <div 
            className={cn(
                "text-white",
                "mb-6"
            )}
            style={containerStyle as React.CSSProperties} // Explicitly specify the type of containerStyle
        >
            <Image
                src="/smooth.svg"
                alt="Stream It"
                width={48} // Decreased size
                height={48} // Decreased size
            />
            <span 
                className={cn(
                    "font-sans",
                    "text-lg font-bold",
                )}
                style={hoverStyle}
            >
                Stream It
            </span>
        </div>
    );
};
