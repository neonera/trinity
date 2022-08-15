<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { BowlersType, PinsType } from "./types";
	import UserScreen from "./UserScreen/UserScreen.svelte";
	import TVScreen from "./TVScreen/TVScreen.svelte";

	let bowlingAlleyName = "Lava Lanes";
	let bowlingAlleyColor = "hsl(8deg, 75%, 50%)";
	let laneNumber = 27;
	let bowlerAmt = 0;
	let games = 0;
	let currentGame = 0;
	let screenType = "";

	// prettier-ignore
	let bowlers: BowlersType = {
		DOM: /*    */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 7], [5, 0], [5, 1]] },
		JAYDEN: /* */ { frames: [[9, 0], [3, 4], [7, 1], [10, 0], [1, 9], [4, 1], [10, 0]] },
		AJ: /*     */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 9], [5, 0], [9]] },
		LOS34: /*  */ { frames: [[7, 2], [3, 6], [7, 1], [10, 0], [0, 9], [5, 0]] },
		EVERETT: /**/ { frames: [[1, 0], [0, 2], [3, 1], [4, 0], [0, 5], [4, 0]] },
	};
	let pins: PinsType = [5];
	let currentBowler = "AJ";
	let currentFrame = 7;

	const bowlPins = (pins_knocked: PinsType) => {
		if (currentFrame === 11) return;

		const pins_amt = pins_knocked.length;
		let reset_pins = pins_amt === pins.length;
		pins_knocked.forEach((pin_num) => {
			const index = pins.indexOf(pin_num);
			if (index > -1) pins.splice(index, 1);
		});
		pins = pins;

		const frames = bowlers[currentBowler].frames;
		const next_frame = frames.length ?? 0;
		const last_frame = next_frame - 1;
		let next_player = false;
		if (frames.length === 0) {
			if (pins_amt === 10) {
				bowlers[currentBowler].frames[0] = [10, 0];
				next_player = true;
			} else bowlers[currentBowler].frames[0] = [pins_amt];
		} else if (frames.length < 10) {
			if (frames[last_frame].length === 1) {
				bowlers[currentBowler].frames[last_frame] = [frames[last_frame][0], pins_amt];
				next_player = true;
			} else if (frames[last_frame].length === 2) {
				if (pins_amt === 10) {
					if (frames[8]) bowlers[currentBowler].frames[next_frame] = [10];
					else bowlers[currentBowler].frames[next_frame] = [10, 0];
					if (next_frame < 9) next_player = true;
				} else bowlers[currentBowler].frames[next_frame] = [pins_amt];
			}
		} else if (frames[9].length === 1) {
			bowlers[currentBowler].frames[9] = [frames[9][0], pins_amt];
			if (frames[9][0] !== 10 && frames[9][0] + pins_amt !== 10) next_player = true;
		} else if (frames[9].length === 2 && (frames[9][0] === 10 || frames[9][0] + frames[9][1] === 10)) {
			bowlers[currentBowler].frames[9] = [frames[9][0], frames[9][1], pins_amt];
			next_player = true;
		}
		if (next_player) {
			reset_pins = true;
			const bowler_names = Object.keys(bowlers);
			const next_index = bowler_names.indexOf(currentBowler) + 1;
			const back_to_start = next_index >= bowler_names.length;
			if (back_to_start) currentFrame++;
			currentBowler = bowler_names[back_to_start ? 0 : next_index];
		}
		if (reset_pins) pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	};

	const startGame = (names: string[]) => {
		names.forEach((name) => {
			bowlers[name] = { frames: [] };
		});
		pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		currentBowler = "";
		currentFrame = 1;
		screenType = "user";
		currentBowler = names[0];
		currentGame++;
	};

	// FOR DEMO PURPOSES:

	const randomPins = (amt?: number) => {
		// Only for testing purposes
		const frames = bowlers[currentBowler].frames;
		const last_frame = frames.at(-1) ?? [];
		if (isNaN(amt)) amt = Math.round(Math.random() * (10 - (last_frame.at(-1) ?? 0)));
		else if (amt > pins.length) amt = pins.length;

		let returned_pins: PinsType = [];
		const possible_pins: PinsType = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		for (let i = 0; i < amt; i++) {
			let random = 0;
			while (returned_pins.includes(random)) {
				random = possible_pins[Math.floor(Math.random() * possible_pins.length)];
			}
			returned_pins.push(random);
		}
		return returned_pins;
	};

	const keyPress = (event: KeyboardEvent) => {
		if (event.key === "u") {
			screenType = "user";
			startSocket(27, "user");
		} else if (event.key === "t") {
			screenType = "tv";
			startSocket(27, "tv");
		} else if (event.key === "a") {
			screenType = "admin";
			startSocket(27, "admin", "test");
		} else if (event.key === "b") {
			bowlPins(randomPins());
		} else if (Number.isInteger(+event.key)) {
			if (bowlerAmt === 0) {
				bowlerAmt = +event.key > 6 ? 6 : +event.key;
				games = 2;
			} else bowlPins(randomPins(+event.key));
		} else if (event.key === "/") bowlPins(pins);
		else if (event.key === "i") {
			if (interval) {
				clearInterval(interval);
				interval = null;
			} else {
				const bowler_names = Object.keys(bowlers);
				const next_index = bowler_names.indexOf(currentBowler) - 1;
				const back_to_start = next_index < 0;
				const lastBowler = bowler_names[back_to_start ? bowler_names.length - 1 : next_index];
				const ms_frame = bowlers[lastBowler].frames.at(-1) ?? [];

				const part1 = ms_frame[0]?.toString() ?? "0";
				const part2 = ms_frame[1]?.toString() ?? "5";
				const ms = +(part1 + part2) * 100;
				console.log(ms);
				interval = setInterval(advanceGame, ms);
			}
		} else if (event.key === "n") {
			const alley_names = ["Lava Lanes", "Roxy Ann Lanes", "Caveman Bowl"];
			const alley_colors = ["hsl(8deg, 75%, 50%)", "hsl(355deg, 60%, 50%)", "hsl(180deg, 60%, 55%)"];
			const next_index = alley_names.indexOf(bowlingAlleyName) + 1;
			const back_to_start = next_index >= alley_names.length;
			bowlingAlleyName = alley_names[back_to_start ? 0 : next_index];
			bowlingAlleyColor = alley_colors[back_to_start ? 0 : next_index];
		}
	};

	const resetGame = () => {
		bowlers = {};
		pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		currentBowler = "";
		currentFrame = 1;
		games = 0;
		currentGame = 0;
	};
	const advanceGame = () => {
		bowlPins(randomPins());
		if (currentFrame === 11) clearInterval(interval);
	};
	let interval;
	resetGame();
	onDestroy(() => clearInterval(interval));

	$: if (bowlerAmt === 0) resetGame();

	let socket;
	const startSocket = (lane: number, type: "tv" | "user" | "admin", pass?: string) => {
		socket = new WebSocket("ws://localhost:2053");

		socket.onopen = (event: Event) => {
			// socket.send(JSON.stringify({ command: "initialize", lane, type, pass }));
			socket_functions.initialize(lane, type, pass);
		};

		socket.onmessage = (event) => {
			const jsonData = JSON.parse(event.data);
			console.log("WebSocket received:", jsonData);

			if (jsonData.command === "initialize") {
				if (jsonData.response === true) {
					laneNumber = jsonData.lane;
					screenType = jsonData.type;
					if (jsonData.type === "admin") {
						// For testing purposes
						socket_functions.create_lanes([27]);
					}
				}
			}
		};

		socket.onclose = (event) => {
			console.log("WebSocket closed");
		};
	};

	const send_websocket_message = (jsonData: { command: string; [prop: string]: any }) => {
		const jsonString = JSON.stringify(jsonData);
		console.log("WebSocket sending: " + jsonString);
		socket?.send(jsonString);
	};

	const socket_functions = {
		initialize: (lane: number, type: string, pass?: string) =>
			send_websocket_message({ command: "initialize", lane, type, pass }),

		// Admin
		create_lanes: (lanes: number[]) => send_websocket_message({ command: "create_lanes", lanes }),
	};
</script>

<svelte:window on:keypress={keyPress} />
{#if screenType === "user"}
	<UserScreen
		{bowlingAlleyName}
		{bowlingAlleyColor}
		{bowlerAmt}
		{games}
		{currentGame}
		{startGame}
		{laneNumber}
		{bowlers}
		{pins}
		{currentBowler}
		{currentFrame} />
{:else if screenType === "tv"}
	<TVScreen
		{bowlingAlleyName}
		{bowlingAlleyColor}
		{bowlerAmt}
		{games}
		{laneNumber}
		{bowlers}
		{pins}
		{currentBowler}
		{currentFrame} />
{:else}
	<main class="center" style="flex-direction: column;">
		<h1 class="trinityText">Trinity Bowling Software</h1>
		<h1 class="keybind">Press <span>T</span> to enter TV mode</h1>
		<h1 class="keybind">Press <span>U</span> to enter User mode</h1>
	</main>
{/if}

<style>
	.trinityText {
		margin-bottom: 20px;

		color: hsl(220deg 80% 70%);
	}
	@supports (-webkit-text-fill-color: transparent) and (-webkit-background-clip: text) {
		.trinityText {
			background: -webkit-linear-gradient(-45deg, hsl(220deg 80% 80%), hsl(220deg 80% 60%));
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
	.keybind {
		color: #fffd;
		font-size: 26px;
	}
	.keybind > span {
		color: hsl(0deg 70% 80%);
	}
</style>
