<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { Bowlers, Pins } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";

	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let bowlerAmt: number;

	export let laneNumber: number;
	export let bowlers: Bowlers;
	export let pins: Pins;
	export let currentBowler: string;
	export let currentFrame: number;

	let calc_frames: { [bowler: string]: CalcFrames } = {};
	$: Object.keys(bowlers).forEach((bowler) => (calc_frames[bowler] = calculateFrames(bowlers[bowler].frames)));
</script>

<main style={Object.keys(bowlers).length > 0 ? "padding-top: 100px;" : ""}>
	<div class="lane-number">
		<h1>{laneNumber}</h1>
	</div>
	{#if Object.keys(bowlers).length === 0}
		{#if bowlerAmt > 0}
			<h1 style="position: absolute; top: 20px; right: 20px;">{bowlerAmt} bowlers</h1>
		{/if}
		<div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
			<h1 style="font-size: 48px;">
				Welcome to <span style="color: {bowlingAlleyColor};">{bowlingAlleyName}</span>.
			</h1>
			{#if bowlerAmt > 0}
				<h1 style="margin-top: 10px; color: #fffa;">Waiting for bowler names...</h1>
			{/if}
		</div>
	{:else}
		<div class="pins">
			<DotPins {pins} />
		</div>
		{#each Object.keys(bowlers) as bowler, bowler_index}
			<div class="bowler-row">
				<div
					class="bowler-name"
					style={(bowler_index === 0 ? "margin-top: 30px;" : "") +
						(bowler === currentBowler ? "background-color: hsl(220deg 50% 55%);" : "")}>
					<h1>{bowler}</h1>
				</div>
				{#each [...Array(11).keys()] as i}
					<Frame
						frame={bowlers[bowler].frames[i] ?? []}
						score={i + 1 === 11
							? calc_frames[bowler].values.reduce((acc, val) => (val && val > acc ? val : acc), 0)
							: calc_frames[bowler].values[i] ?? null}
						{currentFrame}
						frameNumber={i + 1}
						showFrameNumber={bowler_index === 0}
						style={bowler_index === 0 ? "height: 110px;" : ""}
						tvSize
						hide={bowler !== currentBowler} />
				{/each}
			</div>
		{/each}
	{/if}
</main>

<style>
	.lane-number {
		position: absolute;
		width: 100px;
		height: 100px;
		top: 0;
		left: 0;
		margin-bottom: 10px;

		background-color: #313235;
		border-bottom-right-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lane-number > h1 {
		font-size: 48px;
	}

	.pins {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.bowler-row {
		margin-top: 10px;

		transition: filter 0.5s;

		display: flex;
		align-items: center;
	}
	.bowler-name {
		width: 250px;
		height: 80px;

		background-color: #28282a;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		transition: background-color 0.5s;

		display: flex;
		align-items: center;
	}
	.bowler-name > h1 {
		margin-left: 20px;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
