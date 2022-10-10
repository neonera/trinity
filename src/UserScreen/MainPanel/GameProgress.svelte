<script lang="ts">
	import type { BowlersType, LanesData } from "../../types";
	import { calculateFrames, hslToHex, type CalcFrames } from "../../smallFunctions";
	import Progress from "../../lib/Progress.svelte";

	export let laneData: LanesData;

	let gamesAmt: number;
	let bowlers: BowlersType;
	let currentGame: number;

	$: {
		gamesAmt = laneData.gamesAmt;
		bowlers = laneData.bowlers;
		currentGame = laneData.currentGame;
	}

	let calc_frames: { [bowler: string]: CalcFrames } = {};
	let first_place: string[] = [];
	let second_place: string[] = [];
	let third_place: string[] = [];
	$: {
		let f_score: number = 0;
		let s_score: number = 0;
		let t_score: number = 0;
		Object.keys(bowlers).forEach((bowler) => {
			calc_frames[bowler] = calculateFrames(bowlers[bowler].frames);
			const my_score = calc_frames[bowler].currentValue;
			if (my_score === 0) return;
			if (my_score > f_score) {
				t_score = s_score;
				s_score = f_score;
				f_score = my_score;
				third_place = second_place;
				second_place = first_place;
				first_place = [bowler];
			} else if (my_score === f_score) {
				first_place.push(bowler);
			} else if (my_score > s_score) {
				t_score = s_score;
				s_score = my_score;
				third_place = second_place;
				second_place = [bowler];
			} else if (my_score === s_score) {
				second_place.push(bowler);
			} else if (my_score > t_score) {
				t_score = my_score;
				third_place = [bowler];
			} else if (my_score === t_score) {
				third_place.push(bowler);
			}
		});
		if (f_score === 0) {
			first_place = [];
			second_place = [];
			third_place = [];
		}
	}
</script>

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
	<div class="page-title">
		<h1>Game Progress</h1>
	</div>
	<h1 style="font-size: 26px; color: #fffa;">Game {currentGame} of {gamesAmt}</h1>
</div>
{#each Object.keys(bowlers) as bowler, i}
	<div style="display: flex; align-items: center; margin-top: 10px;">
		{#if first_place.includes(bowler)}
			<div class="place-badge" style="background-color: hsl(51deg 50% 55%);">
				<h1>#1</h1>
			</div>
		{:else if second_place.includes(bowler)}
			<div class="place-badge" style="background-color: hsl(0deg 0% 60%);">
				<h1>#2</h1>
			</div>
		{:else if third_place.includes(bowler)}
			<div class="place-badge" style="background-color: hsl(30deg 30% 50%);">
				<h1>#3</h1>
			</div>
		{:else}
			<div class="place-badge" />
		{/if}
		<h1 class="name">{bowler}</h1>
		<Progress
			value={calc_frames[bowler].currentValue}
			height={60}
			maxValue={300}
			style="flex: 1;"
			foreground={hslToHex(360 * (i / Object.keys(bowlers).length), 60, 63)} />
	</div>
{/each}

<style>
	.page-title {
		width: fit-content;
		padding: 10px 20px;

		border-radius: 40px;
		background-color: #404244;
	}
	.name {
		width: 200px;
		margin-right: 10px;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.place-badge {
		width: 40px;
		height: 40px;
		margin-right: 15px;

		border-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.place-badge > h1 {
		font-size: 20px;
		font-style: italic;
	}
</style>
