"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "../MessageBubble";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
	CornerDownLeft,
	LoaderCircle,
	LoaderIcon,
	Mic,
	Paperclip,
	Settings,
} from "lucide-react";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";

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
			<ScrollArea className="w-full h-full px-8">
				<div className="flex flex-col gap-4">
					<div className="pt-1" />
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
					{streamedMessage.length === 0 && isLoading && (
						<MessageBubble role="assistant" className="opacity-75">
							<LoaderCircle className="animate-spin" />
						</MessageBubble>
					)}
					{streamedMessage.length > 0 && (
						<MessageBubble role="assistant">
							{streamedMessage}
						</MessageBubble>
					)}
					<div ref={ref} />
				</div>
			</ScrollArea>
			<form
				className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring m-4 pb-4"
				onSubmit={handleSubmit}
			>
				<Label htmlFor="message" className="sr-only">
					Message
				</Label>
				<Textarea
					id="message"
					placeholder="Type your message here..."
					className="min-h-12 resize-none border-0 px-4 py-2 shadow-none focus-visible:ring-0"
					value={currentMessage}
					onChange={(e) => setCurrentMessage(e.target.value)}
				/>
				<div className="flex items-center p-3 pt-0">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon">
								<Paperclip className="size-4" />
								<span className="sr-only">Attach file</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">Attach File</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon">
								<Mic className="size-4" />
								<span className="sr-only">Use Microphone</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">
							Use Microphone
						</TooltipContent>
					</Tooltip>
					<Button
						type="submit"
						size="sm"
						className="ml-auto gap-1.5"
						disabled={
							isLoading || currentMessage.trim().length === 0
						}
					>
						Send Message
						<CornerDownLeft className="size-3.5" />
					</Button>
				</div>
			</form>
		</div>
	);
}
