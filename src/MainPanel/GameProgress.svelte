<script lang="ts">
	import type { Bowlers } from "../types";
	import { calculateFrames, hslToHex, type CalcFrames } from "../smallFunctions";
	import Progress from "../lib/Progress.svelte";

	export let bowlers: Bowlers;

	let calc_frames: { [bowler: string]: CalcFrames } = {};
	$: Object.keys(bowlers).forEach(bowler => calc_frames[bowler] = calculateFrames(bowlers[bowler].frames));
</script>

<div class="game-progress">
	<h1>Game Progress</h1>
</div>
{#each Object.keys(bowlers) as bowler, i}
	<div style="display: flex; align-items: center; margin-top: 10px;">
		<h1 style="width: 200px;">{bowler}</h1>
		<Progress
			value={calc_frames[bowler].currentValue}
			height={60}
			maxValue={300}
			style="flex: 1;"
			foreground={hslToHex(360 * (i / Object.keys(bowlers).length), 60, 63)} />
	</div>
{/each}

<style>
	.game-progress {
		width: fit-content;
		margin-bottom: 20px;
		padding: 10px 20px;

		border-radius: 40px;
		background-color: #404244;
	}
</style>
