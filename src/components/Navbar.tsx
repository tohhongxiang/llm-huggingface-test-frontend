"use client";

export default function Navbar() {
	return (
		<nav className="flex justify-between w-full p-4 border-b border-muted-foreground/10">
			<p>
				<strong>Home</strong>
			</p>
			<ul className="flex gap-4">
				<li>Chat</li>
				<li>Settings</li>
			</ul>
		</nav>
	);
}
