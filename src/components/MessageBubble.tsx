import { cn } from "@/lib/utils";

interface MessageBubbleProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	> {
	role: "user" | "assistant";
}

export default function MessageBubble({
	role,
	children,
	className,
	...props
}: MessageBubbleProps) {
	return (
		<p
			className={cn(
				"p-4 border border-muted-foreground/20 rounded-md inline-block",
				role === "user"
					? "self-end ml-8 bg-white"
					: "self-start bg-primary text-primary-foreground mr-8",
				className
			)}
			{...props}
		>
			{children}
		</p>
	);
}
