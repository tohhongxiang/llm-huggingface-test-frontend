"use client";

import { cn } from "@/lib/utils";
import { Bot, Home, Mic, Image, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

const links = [
	{
		href: "/chat",
		label: "Chat",
		description: "Talk with an AI chatbot",
		icon: <Bot className="size-6" />,
	},
	{
		href: "/waifu-2x",
		label: "Waifu 2X",
		description: "Upscale your images",
		// eslint-disable-next-line jsx-a11y/alt-text
		icon: <Image className="size-6" />,
	},
	{
		href: "/whisper",
		label: "Whisper",
		description: "Transcribe audio files with OpenAI Whisper",
		icon: <Mic className="size-6" />,
	},
	{
		href: "/settings",
		label: "Settings",
		description: "Modify your preferences here",
		icon: <Settings className="size-6" />,
	},
];

export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col h-full border-r border-muted-foreground/30">
			<div className="h-[65px] flex justify-center items-center border-b border-muted-foreground/30">
				<Link href="/">
					<p>
						<Home className="size-6" />
					</p>
				</Link>
			</div>
			<ul className="flex flex-col gap-4 p-2 h-full">
				{links.map((link) => (
					<Tooltip key={link.href}>
						<TooltipTrigger asChild>
							<Link href={link.href}>
								<li
									className={cn(
										"rounded p-2 hover:bg-muted-foreground/10",
										link.href === pathname &&
											"bg-muted-foreground/10"
									)}
								>
									{link.icon}
								</li>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right" className="z-10">
							<p>{link.label}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</ul>
			<ul className="flex flex-col items-center mt-auto p-4 gap-y-4">
				<li>
					<ChevronRight className="size-6" />
				</li>
			</ul>
		</nav>
	);
}
