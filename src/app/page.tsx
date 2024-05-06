"use client";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

export default function Home() {
	const [prompt, setPrompt] = useState("");
	const [data, setData] = useState("");
	const test = async () => {
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
				console.log(event.data);
				setData((data) => data + event.data); // Important to set the data this way, otherwise old data may be overwritten if the stream is too fast
			},
			onclose() {
				console.log("Connection closed by the server");
			},
			onerror(err) {
				console.log("There was an error from server", err);
			},
		});
	};
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<p>Hello world</p>
			<p>{data}</p>
			<input
				type="text"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="border-gray-800"
			/>
			<button onClick={test}>Test</button>
		</main>
	);
}
