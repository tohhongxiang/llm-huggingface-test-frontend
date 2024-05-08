"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "../MessageBubble";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export const ROLES = {
	USER: "user",
	ASSISTANT: "assistant",
} as const;

export type ChatRole = (typeof ROLES)[keyof typeof ROLES];

export interface ChatMessage {
	role: ChatRole;
	content: string;
}

interface ChatProps {
	messages: ChatMessage[];
	streamedMessage: string;
	isLoading: boolean;
	onReset: () => void;
	onSubmit: (messageContents: string) => Promise<void>;
}

export function createMessage(role: ChatRole, content: string) {
	return {
		role,
		content: content.trim(),
	};
}

export default function Chat({
	messages = [],
	streamedMessage = "",
	isLoading,
	onSubmit,
	onReset,
}: ChatProps) {
	const [currentMessage, setCurrentMessage] = useState("");

	const ref = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!ref.current) return;

		ref.current.scrollIntoView();
	}, [streamedMessage, messages]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(currentMessage);
	};

	return (
		<div className="w-full h-full flex flex-col">
			<ScrollArea className="w-full h-full px-8 py-4 bg-muted-foreground/5 shadow-inner">
				<div className="flex flex-col gap-4">
					{messages.length === 0 ? (
						<p className="text-muted-foreground italic">
							No messages. Start chatting!
						</p>
					) : (
						messages.map((message, index) => (
							<MessageBubble key={index} role={message.role}>
								{message.content}
							</MessageBubble>
						))
					)}
					{streamedMessage.length > 0 && (
						<MessageBubble role={"assistant"}>
							{streamedMessage}
						</MessageBubble>
					)}
					<div ref={ref} />
				</div>
			</ScrollArea>
			<form
				className="py-4 px-8 border-t border-muted-foreground/30 bg-white"
				onSubmit={handleSubmit}
			>
				<div className="flex gap-4">
					<Input
						placeholder="Message"
						value={currentMessage}
						onChange={(e) => setCurrentMessage(e.target.value)}
					/>
					<Button disabled={isLoading}>Submit</Button>
					<Button
						type="button"
						disabled={isLoading}
						variant="outline"
						onClick={onReset}
					>
						Reset Chat
					</Button>
				</div>
			</form>
		</div>
	);
}
