<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import TVScreen from "./TVScreen/TVScreen.svelte";
	import type { Bowlers, Pins } from "./types";
	import UserScreen from "./UserScreen/UserScreen.svelte";

	let screenType = "tv";

	// prettier-ignore
	let bowlers: Bowlers = {
		DOM: /*    */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 7], [5, 0], [5, 1]] },
		JAYDEN: /* */ { frames: [[9, 0], [3, 4], [7, 1], [10, 0], [1, 9], [4, 1], [10, 0]] },
		AJ: /*     */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 9], [5, 0], [9]] },
		LOS34: /*  */ { frames: [[7, 2], [3, 6], [7, 1], [10, 0], [0, 9], [5, 0]] },
		EVERETT: /**/ { frames: [[1, 0], [0, 2], [3, 1], [4, 0], [0, 5], [4, 0]] },
	};
	let pins: Pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	let currentBowler = "AJ";
	let currentFrame = 7;

	const bowlPins = (pins_knocked: Pins) => {
		pins_knocked.forEach((pin_num) => {
			const index = pins.indexOf(pin_num);
			if (index > -1) pins.splice(index, 1);
		});
		pins = pins;

		const pins_amt = pins_knocked.length;
		const frames = bowlers[currentBowler].frames;
		const next_frame = frames.length ?? 0;
		const last_frame = next_frame - 1;
		let reset_pins = false;
		if (frames.length === 0) {
			if (pins_amt === 10) bowlers[currentBowler].frames[0] = [10, 0];
			else bowlers[currentBowler].frames[0] = [pins_amt];
		} else if (frames.length < 10) {
			if (frames[last_frame].length === 1) {
				bowlers[currentBowler].frames[last_frame] = [frames[last_frame][0], pins_amt];
				reset_pins = true;
			} else if (frames[last_frame].length === 2) {
				if (pins_amt === 10) {
					if (frames[8]) bowlers[currentBowler].frames[next_frame] = [10];
					else bowlers[currentBowler].frames[next_frame] = [10, 0];
					reset_pins = true;
				} else bowlers[currentBowler].frames[next_frame] = [pins_amt];
			}
		} else if (frames[9].length === 1) {
			bowlers[currentBowler].frames[9] = [frames[9][0], pins_amt];
			if (frames[9][0] !== 10 && frames[9][0] + pins_amt !== 10) reset_pins = true;
		} else if (frames[9].length === 2 && (frames[9][0] === 10 || frames[9][0] + frames[9][1] === 10)) {
			bowlers[currentBowler].frames[9] = [frames[9][0], frames[9][1], pins_amt];
			reset_pins = true;
		}
		if (reset_pins) pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	};

	const keyPress = (event: KeyboardEvent) => {
		if (event.key === "u") screenType = "user";
		else if (event.key === "t") screenType = "tv";
		else if (+event.key) {
			const this_bowler = Object.keys(bowlers)[+event.key - 1];
			if (this_bowler) currentBowler = Object.keys(bowlers)[+event.key - 1];
		} else if (event.key === "b") {
			const last_frame = bowlers[currentBowler].frames.at(-1) ?? [];
			const p = Math.round(Math.random() * (10 - (last_frame.at(-1) ?? 0)));
			bowlPins([...Array(p).keys()]);
		} else if (event.key === "s") bowlPins([...Array(10).keys()]);
	};

	const advanceGame = () => {
		const bowler_names = Object.keys(bowlers);
		const frames = bowlers[currentBowler].frames;
		let last_frame = frames.at(-1) ?? [];
		const p = Math.round(Math.random() * (10 - (last_frame.at(-1) ?? 0)));
		let pins_to_bowl: Pins = [];
		const possible_pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		for (let i = 0; i < p; i++) {
			let random = 0;
			while (pins_to_bowl.includes(random)) {
				random = possible_pins[Math.floor(Math.random() * possible_pins.length)];
			}
			pins_to_bowl.push(random);
		}
		bowlPins(pins_to_bowl);
		last_frame = frames.at(-1) ?? [];
		const mid_frame_done = frames.length < 10 && last_frame.length === 2;
		const last_frame_done = frames.length === 10 && (last_frame.length === 3 || last_frame[0] + last_frame[1] < 10);
		if (mid_frame_done || last_frame_done) {
			const next_index = bowler_names.indexOf(currentBowler) + 1;
			const back_to_start = next_index >= bowler_names.length;
			if (back_to_start) currentFrame++;
			if (last_frame_done && back_to_start) clearInterval(interval);
			else currentBowler = bowler_names[back_to_start ? 0 : next_index];
		}
	};
	let interval;
	onMount(() => {
		Object.keys(bowlers).forEach((bowler) => (bowlers[bowler] = { frames: [] }));
		currentBowler = Object.keys(bowlers)[0];
		currentFrame = 1;
		interval = setInterval(advanceGame, 100);
	});
	onDestroy(() => clearInterval(interval));
</script>

<svelte:window on:keypress={keyPress} />
{#if screenType === "user"}
	<UserScreen {bowlers} {pins} {currentBowler} {currentFrame} />
{:else if screenType === "tv"}
	<TVScreen {bowlers} {pins} {currentBowler} {currentFrame} />
{/if}
