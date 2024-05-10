"use client";

import { cn } from "@/lib/utils";
import {
	Bot,
	Home,
	Mic,
	Image,
	Settings,
	ChevronRight,
	ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useState } from "react";

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

	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav
			className={cn(
				"flex flex-col h-full border-r border-muted-foreground/30",
				isOpen && "w-72"
			)}
		>
			<div className="h-[65px] flex justify-center items-center border-b border-muted-foreground/30">
				<Link href="/">
					<p>
						<Home className="size-6" />
					</p>
				</Link>
			</div>
			<ul className="flex flex-col items-center gap-4 h-full p-2">
				{links.map((link) =>
					isOpen ? (
						<Link
							href={link.href}
							key={link.href}
							className={cn(
								"rounded p-2 hover:bg-muted-foreground/10 w-full",
								link.href === pathname &&
									"bg-muted-foreground/10"
							)}
						>
							<li className="flex justify-start gap-2 items-center">
								{link.icon}
								<p
									className={cn(
										"text-sm",
										link.href === pathname &&
											"font-semibold"
									)}
								>
									{link.label}
								</p>
							</li>
						</Link>
					) : (
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
					)
				)}
			</ul>
			<ul className="flex flex-col items-center mt-auto gap-y-4 p-2">
				<li className="ml-auto">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsOpen((c) => !c)}
					>
						{isOpen ? (
							<ChevronLeft className="size-6" />
						) : (
							<ChevronRight className="size-6" />
						)}
					</Button>
				</li>
			</ul>
		</nav>
	);
}
