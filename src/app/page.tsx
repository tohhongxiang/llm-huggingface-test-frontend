import { Bot, Image, Mic } from "lucide-react";
import Link from "next/link";

const links = [
	{
		href: "/chat",
		label: "Chat",
		description: "Talk with an AI chatbot",
		icon: <Bot className="size-8" />,
	},
	{
		href: "/waifu-2x",
		label: "Waifu 2X",
		description: "Upscale your images",
		// eslint-disable-next-line jsx-a11y/alt-text
		icon: <Image className="size-8" />,
	},
	{
		href: "/whisper",
		label: "Whisper",
		description: "Transcribe audio files with OpenAI Whisper",
		icon: <Mic className="size-8" />,
	},
];

export default function Home() {
	return (
		<div className="flex items-center justify-center h-full">
			<ul className="grid grid-cols-2 gap-4">
				{links.map((link, index) => (
					<li key={link.href}>
						<Link href={link.href}>
							<div className="border p-4 rounded-md">
								<div className="flex items-center justify-start gap-x-2 mb-4">
									{link.icon}
									<p className="text-lg font-semibold">
										{link.label}
									</p>
								</div>
								<p className="text-muted-foreground">
									{link.description}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
