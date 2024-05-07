interface MessageBubbleProps {
	children: React.ReactNode;
}

export default function MessageBubble({ children }: MessageBubbleProps) {
	return (
		<p className="p-4 border border-muted-foreground/10 rounded-md">
			{children}
		</p>
	);
}
