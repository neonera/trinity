<script context="module" lang="ts">
	let socket;
	const send_websocket_message = (jsonData: { command: string; [prop: string]: any }) => {
		const jsonString = JSON.stringify(jsonData);
		console.log("WebSocket sending: " + jsonString);
		socket?.send(jsonString);
	};

	export const socket_functions = {
		initialize: (lane: number, type: string, pass?: string) =>
			send_websocket_message({ command: "initialize", lane, type, pass }),
		start_game: (names: string[]) => send_websocket_message({ command: "start_game", names }),

		// Admin
		create_lanes: (lanes: number[]) => send_websocket_message({ command: "create_lanes", lanes }),
		set_bowlers: (lane: number, bowlers: number) =>
			send_websocket_message({ command: "set_bowlers", lane, bowlers }),
		set_games: (lane: number, games: number) => send_websocket_message({ command: "set_games", lane, games }),
	};
</script>

<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { BowlersType, Lanes, PinsType } from "./types";
	import UserScreen from "./UserScreen/UserScreen.svelte";
	import TVScreen from "./TVScreen/TVScreen.svelte";
	import AdminScreen from "./AdminScreen/AdminScreen.svelte";

	let bowlingAlleyName = "Lava Lanes";
	let bowlingAlleyColor = "hsl(8deg, 75%, 50%)";
	let laneNumber = 27;
	let bowlerAmt = 0;
	let gamesAmt = 0;
	let currentGame = 0;
	let screenType = "";

	// Admin only
	let lanes: Lanes = {};

	// TV/User
	let past_games: BowlersType[] = [];
	let bowlers: BowlersType = {};
	let pins: PinsType = [];
	let currentBowler = "";
	let currentFrame = 0;

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
		// if (currentGame > 0) past_games.push(bowlers);
		// names.forEach((name) => {
		// 	bowlers[name] = { frames: [] };
		// });
		// pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		// currentFrame = 1;
		// currentBowler = names[0];
		// currentGame++;
		socket_functions.start_game(names);
	};

	const keyPress = (event: KeyboardEvent) => {
		if (event.key === "u") {
			screenType = "user";
			startSocket(1, "user");
		} else if (event.key === "t") {
			screenType = "tv";
			startSocket(1, "tv");
		} else if (event.key === "a") {
			screenType = "admin";
			startSocket(0, "admin", "test");
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
		gamesAmt = 0;
		currentGame = 0;
	};
	resetGame();

	$: if (bowlerAmt === 0) resetGame();

	const startSocket = (lane: number, type: "tv" | "user" | "admin", pass?: string) => {
		socket?.close?.();
		socket = new WebSocket("ws://localhost:2053");

		socket.onopen = (event: Event) => {
			socket_functions.initialize(lane, type, pass);
		};

		socket.onmessage = (event) => {
			const jsonData = JSON.parse(event.data);
			console.log("WebSocket received:", jsonData);

			if (jsonData.command === "initialize") {
				if (jsonData.response === true) {
					laneNumber = jsonData.lane;
					screenType = jsonData.type;

					bowlerAmt = jsonData.bowlerAmt;
					gamesAmt = jsonData.gamesAmt;
					currentBowler = jsonData.currentBowler;
					currentFrame = jsonData.currentFrame;
					currentGame = jsonData.currentGame;

					bowlers = jsonData.bowlers;
					pins = jsonData.pins;

					if (jsonData.type === "admin") {
						lanes = jsonData.lanes;
					}
				}
			} else if (jsonData.command === "get_games") {
				if (jsonData.response === true) {
					gamesAmt = jsonData.games;
				}
			} else if (jsonData.command === "get_bowlers") {
				if (jsonData.response === true) {
					bowlerAmt = jsonData.bowlers;
				}
			} else if (jsonData.command === "start_game") {
				if (jsonData.response === true) {
					if (screenType === "admin") {
						if (currentGame > 0) past_games.push(bowlers);
						jsonData.names.forEach((name) => {
							bowlers[name] = { frames: [] };
						});
						pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
						currentFrame = 1;
						currentBowler = jsonData.names[0];
						currentGame++;
					} else {
						if (currentGame > 0) past_games.push(bowlers);
						jsonData.names.forEach((name) => {
							bowlers[name] = { frames: [] };
						});
						pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
						currentFrame = 1;
						currentBowler = jsonData.names[0];
						currentGame++;
					}
				}
			} else if (jsonData.command === "bowl_pins") {
				if (jsonData.response === true) {
					bowlPins(jsonData.pins_knocked);
				}
			}

			// Admin
			else if (jsonData.command === "update_lanes") {
				lanes = jsonData.lanes;
			} else if (jsonData.command === "set_games") {
				if (jsonData.response === true) {
					lanes[jsonData.lane].data.gamesAmt = jsonData.games;
				}
			} else if (jsonData.command === "set_bowlers") {
				if (jsonData.response === true) {
					console.log(lanes);
					console.log(jsonData.lane);
					console.log(lanes[jsonData.lane]);
					lanes[jsonData.lane].data.bowlerAmt = jsonData.bowlers;
				}
			}
		};

		socket.onclose = (event) => {
			console.log("WebSocket closed");
		};
	};
</script>

<svelte:window on:keypress={keyPress} />
{#if screenType === "user"}
	<UserScreen
		{bowlingAlleyName}
		{bowlingAlleyColor}
		{bowlerAmt}
		{gamesAmt}
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
		{gamesAmt}
		{laneNumber}
		{bowlers}
		{pins}
		{currentBowler}
		{currentFrame} />
{:else if screenType === "admin"}
	<AdminScreen {bowlingAlleyName} {bowlingAlleyColor} {lanes} />
{:else}
	<main class="center" style="flex-direction: column;">
		<h1 class="trinityText">Trinity Bowling Software</h1>
		<h1 class="keybind">Press <span>T</span> to enter TV mode</h1>
		<h1 class="keybind">Press <span>U</span> to enter User mode</h1>
		<h1 class="keybind">Press <span>A</span> to enter Admin mode</h1>
	</main>
{/if}

<style>
	:global(.trinityText) {
		margin-bottom: 20px;

		color: hsl(220deg 80% 70%);
	}
	@supports (-webkit-text-fill-color: transparent) and (-webkit-background-clip: text) {
		:global(.trinityText) {
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
