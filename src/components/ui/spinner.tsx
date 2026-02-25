import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
    className?: string;
    size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
    return (
        <Loader2
            className={cn("animate-spin text-primary", className)}
            size={size}
        />
    );
}

export function FullPageSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <Spinner size={40} />
        </div>
    );
}
