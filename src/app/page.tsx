"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MessageBubble from "@/components/MessageBubble";

interface ChatMessage {
	role: string;
	content: string;
}

function createMessage(role: string, content: string) {
	return {
		role,
		content: content.trim(),
	};
}

export default function Home() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true);
		setMessages((prevMessages) => [
			...prevMessages,
			createMessage("user", prompt),
		]);

		setPrompt("");

		let currentMessage = "";
		await fetchEventSource(`http://localhost:8000/api/query`, {
			method: "POST",
			headers: {
				Accept: "text/event-stream",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
			async onopen(res) {
				if (res.ok && res.status === 200) {
					console.log("Connection made ", res);
				} else if (
					res.status >= 400 &&
					res.status < 500 &&
					res.status !== 429
				) {
					console.log("Client-side error ", res);
				}
			},
			onmessage(event) {
				currentMessage += event.data;
				setData(currentMessage);
			},
			onclose() {
				console.log("Connection closed");

				setIsLoading(false);

				setMessages((prevMessages) => [
					...prevMessages,
					createMessage("assistant", currentMessage),
				]);

				setData("");
			},
			onerror(err) {
				console.log("There was an error from server", err);
			},
		});
	};

	const resetChat = () => {
		setMessages([]);
	};

	const ref = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!ref.current) return;

		ref.current.scrollIntoView();
	}, [data, messages]);

	console.log("Messages", messages);

	return (
		<div className="flex justify-center items-center h-full w-full relative">
			<div className="border-muted-foreground/10 w-3/5 h-full px-8 py-4">
				<h1 className="text-lg font-semibold mb-8">
					Prompt settings section
				</h1>
				<form className="w-full flex flex-col gap-4">
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="user_name">User Name</Label>
						<Input id="user_name" type="text" placeholder="Jason" />
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="char_name">Character Name</Label>
						<Input
							id="char_name"
							type="text"
							placeholder="Cassandra"
						/>
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="personality">
							Character Personality
						</Label>
						<Textarea
							id="personality"
							placeholder="A playful, fun-loving..."
						/>
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="scene_description">
							Scene Description
						</Label>
						<Textarea
							id="scene_description"
							placeholder="The 2 characters are standing in a field..."
						/>
					</div>
				</form>
			</div>
			<div className="border-l border-muted-foreground/10 w-full h-full flex flex-col">
				<div className="w-full h-full overflow-auto px-8 py-4 flex flex-col gap-4">
					{messages.length === 0 ? (
						<p className="text-muted-foreground italic">
							No messages. Start chatting!
						</p>
					) : (
						messages.map((message, index) => (
							<MessageBubble key={index}>
								{message.content}
							</MessageBubble>
						))
					)}
					{data.length > 0 && <MessageBubble>{data}</MessageBubble>}
					<div ref={ref} />
				</div>
				<form
					className="py-4 px-8 border-t border-muted-foreground/10"
					onSubmit={handleSubmit}
				>
					<div className="flex gap-4">
						<Input
							placeholder="Message"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
						/>
						<Button disabled={isLoading}>Submit</Button>
						<Button
							type="button"
							disabled={isLoading}
							variant="outline"
							onClick={resetChat}
						>
							Reset Chat
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
