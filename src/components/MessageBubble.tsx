import { cn } from "@/lib/utils";

interface MessageBubbleProps {
	role: "user" | "assistant";
	children: React.ReactNode;
}

export default function MessageBubble({ role, children }: MessageBubbleProps) {
	return (
		<p
			className={cn(
				"p-4 border border-muted-foreground/20 rounded-md inline-block",
				role === "user"
					? "self-end ml-8 bg-white"
					: "self-start bg-primary text-primary-foreground mr-8"
			)}
		>
			{children}
		</p>
	);
}
