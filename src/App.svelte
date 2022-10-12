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
		add_bowler: (lane: number, name: string) => send_websocket_message({ command: "add_bowler", lane, name }),
		stop_session: (lane: number) => send_websocket_message({ command: "stop_session", lane }),
	};
</script>

<script lang="ts">
	import type { BowlersType, Lanes, LanesData, PinsType } from "./types";
	import UserScreen from "./UserScreen/UserScreen.svelte";
	import TVScreen from "./TVScreen/TVScreen.svelte";
	import AdminScreen from "./AdminScreen/AdminScreen.svelte";

	let bowlingAlleyName = "";
	let bowlingAlleyColor = "";
	let laneNumber = 0;
	let bowlersAmt = 0;
	let gamesAmt = 0;
	let currentGame = 0;
	let screenType = "";

	// Admin only
	let lanes: Lanes = {};

	// TV/User
	let laneData: LanesData = {
		bowlersAmt: 0,
		gamesAmt: 0,
		currentBowler: "",
		currentGame: 0,
		currentFrame: 0,
		bowlers: {},
		pastGames: [],
		pins: [],
	};
	let pastGames: BowlersType[] = [];
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
		// if (currentGame > 0) pastGames.push(bowlers);
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
		if (screenType === "") {
			if (event.key === "u") {
				screenType = "user";
				startSocket(1, "user");
			} else if (event.key === "t") {
				screenType = "tv";
				startSocket(1, "tv");
			} else if (event.key === "a") {
				screenType = "admin";
				startSocket(0, "admin", "test");
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
		gamesAmt = 0;
		currentGame = 0;
	};
	resetGame();

	$: if (bowlersAmt === 0) resetGame();

	const startSocket = (lane: number, type: "tv" | "user" | "admin", pass?: string) => {
		socket?.close?.();
		socket = new WebSocket("ws://localhost:2053");

		socket.onopen = (event: Event) => {
			socket_functions.initialize(lane, type, pass);
		};

		socket.onmessage = (event) => {
			// For checking websocket payload size
			const color = "hsl(272deg 87% 85%)";
			if (event.data.length < 1_000) {
				const num = event.data.length;
				console.log("%c" + num + " B", `color: ${color};`);
			} else if (event.data.length < 1_000_000) {
				const num = (event.data.length / 1_000).toFixed(2);
				console.log("%c" + num + " KB", `color: ${color};`);
			} else {
				const num = (event.data.length / 1_000_000).toFixed(2);
				console.log("%c" + num + " MB", `color: ${color};`);
			}

			const jsonData = JSON.parse(event.data);
			console.log("WebSocket received:", jsonData);
			if (jsonData.command === "initialize") {
				if (jsonData.response === true) {
					laneNumber = jsonData.lane;
					screenType = jsonData.type;
					bowlingAlleyName = jsonData.bowlingAlleyName;
					bowlingAlleyColor = jsonData.bowlingAlleyColor;

					if (jsonData.type === "admin") {
						lanes = jsonData.lanes;
					} else {
						laneData = jsonData.laneData;
					}
				}
			} else if (jsonData.command === "update_lane") {
				if (screenType === "admin") {
					if (jsonData.attr) {
						lanes[jsonData.lane].tv = jsonData.laneData.tv;
						lanes[jsonData.lane].user = jsonData.laneData.user;
						jsonData.attr.forEach((attr) => {
							lanes[jsonData.lane].data[attr] = jsonData.laneData.data[attr];
						});
					} else lanes[jsonData.lane] = jsonData.laneData;
				} else {
					if (jsonData.attr) {
						jsonData.attr.forEach((attr) => {
							laneData[attr] = jsonData.laneData[attr];
						});
					} else laneData = jsonData.laneData;
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
	<UserScreen {laneNumber} {bowlingAlleyName} {bowlingAlleyColor} {laneData} />
{:else if screenType === "tv"}
	<TVScreen {bowlingAlleyName} {bowlingAlleyColor} {laneData} {laneNumber} />\
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
