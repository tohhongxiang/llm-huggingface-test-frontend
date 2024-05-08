"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Chat, { ChatMessage, createMessage } from "@/components/chat";

export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ role: "user", content: "Hello, how are you?" },
		{ role: "assistant", content: "I'm fine, thanks! How are you?" },
		{ role: "user", content: "Hello, how are you?" },
		{ role: "assistant", content: "I'm fine, thanks! How are you?" },
		{ role: "user", content: "Hello, how are you?" },
		{ role: "assistant", content: "I'm fine, thanks! How are you?" },
		{ role: "user", content: "Hello, how are you?" },
		{ role: "assistant", content: "I'm fine, thanks! How are you?" },
		{ role: "user", content: "I'm fine as well. Thanks for asking" },
		{
			role: "assistant",
			content:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		},
		{
			role: "user",
			content:
				"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
		},
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [generatedMessage, setGeneratedMessage] = useState("");

	const handleSubmit = async (newMessage: string) => {
		setIsLoading(true);
		setMessages((prevMessages) => [
			...prevMessages,
			createMessage("user", newMessage),
		]);

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
				setGeneratedMessage(currentMessage);
			},
			onclose() {
				console.log("Connection closed");

				setIsLoading(false);

				setMessages((prevMessages) => [
					...prevMessages,
					createMessage("assistant", currentMessage),
				]);

				setGeneratedMessage("");
			},
			onerror(err) {
				console.log("There was an error from server", err);
			},
		});
	};

	const resetChat = () => {
		setMessages([]);
	};

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
			<Chat
				messages={messages}
				streamedMessage={generatedMessage}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onReset={resetChat}
			/>
		</div>
	);
}
