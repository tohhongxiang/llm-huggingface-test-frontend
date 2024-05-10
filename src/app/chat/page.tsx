"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Chat, { ChatMessage, createMessage } from "@/components/chat";
import { Button } from "@/components/ui/button";
import { RotateCcw, Settings2, Share } from "lucide-react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
	const [generatedMessage, setGeneratedMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (newMessage: string) => {
		console.log({
			newMessage,
			configuration,
		});
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

	const [configuration, setConfiguration] = useState({
		username: "",
		characterName: "",
		characterPersonality: "",
		sceneDescription: "",
	});

	return (
		<div className="flex flex-col h-full w-full relative overflow-hidden">
			<div className="border-b border-muted-foreground/30 py-2 px-4 flex justify-between items-center">
				<h1 className="text-xl font-semibold">Chat Playground</h1>
				<div className="flex">
					<Drawer>
						<DrawerTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
							>
								<Settings2 className="size-4" />
								<span className="sr-only">Settings</span>
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Configuration</DrawerTitle>
							</DrawerHeader>
							<PromptConfigurationForm
								className="p-4"
								configuration={configuration}
								onChange={setConfiguration}
							/>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button>Confirm and Close</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={resetChat}
							>
								<RotateCcw className="size-4" />
								<span className="sr-only">Reset Chat</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Reset Chat</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon">
								<Share className="size-4" />
								<span className="sr-only">Share</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Share</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div className="flex justify-center items-center min-h-0 h-full">
				<div className="border-muted-foreground/10 md:w-full lg:w-3/5 h-full px-8 py-4 md:flex flex-col gap-4 hidden">
					<h1 className="text-lg font-semibold mb-4">
						Configuration
					</h1>
					<PromptConfigurationForm
						configuration={configuration}
						onChange={setConfiguration}
					/>
					<div className="flex justify-end">
						<Button onClick={resetChat}>Reset Chat</Button>
					</div>
				</div>
				<Chat
					messages={messages}
					streamedMessage={generatedMessage}
					isLoading={isLoading}
					onSubmit={handleSubmit}
					onReset={resetChat}
				/>
			</div>
		</div>
	);
}

interface PromptConfigurationFormProps
	extends Omit<
		React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLDivElement>,
			HTMLDivElement
		>,
		"onChange"
	> {
	configuration: {
		username: string;
		characterName: string;
		characterPersonality: string;
		sceneDescription: string;
	};
	onChange: (
		newConfiguration: PromptConfigurationFormProps["configuration"]
	) => void;
}

function PromptConfigurationForm({
	configuration,
	onChange,
	className,
	...props
}: PromptConfigurationFormProps) {
	const handleChange = (key: keyof typeof configuration, value: string) => {
		onChange({ ...configuration, [key]: value });
	};

	return (
		<div className={cn("w-full flex flex-col gap-4", className)} {...props}>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="user_name">User Name</Label>
				<Input
					id="user_name"
					type="text"
					placeholder="Jason"
					value={configuration.username}
					onChange={(e) => handleChange("username", e.target.value)}
				/>
			</div>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="char_name">Character Name</Label>
				<Input
					id="char_name"
					type="text"
					placeholder="Cassandra"
					value={configuration.characterName}
					onChange={(e) =>
						handleChange("characterName", e.target.value)
					}
				/>
			</div>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="personality">Character Personality</Label>
				<Textarea
					id="personality"
					placeholder="A playful, fun-loving..."
					value={configuration.characterPersonality}
					onChange={(e) =>
						handleChange("characterPersonality", e.target.value)
					}
				/>
			</div>
			<div className="grid w-full items-center gap-1.5">
				<Label htmlFor="scene_description">Scene Description</Label>
				<Textarea
					id="scene_description"
					placeholder="The 2 characters are standing in a field..."
					value={configuration.sceneDescription}
					onChange={(e) =>
						handleChange("sceneDescription", e.target.value)
					}
				/>
			</div>
		</div>
	);
}
