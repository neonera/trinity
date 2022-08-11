<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { Bowlers, Pins } from "../types";
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";

	export let laneNumber: number;
	export let bowlers: Bowlers;
	export let pins: Pins;
	export let type: 10 | 9 | 5 = 10;
	export let currentBowler: string;
	export let currentFrame: number;

	let calc_frames: CalcFrames = { values: [], currentValue: 0 };
	$: calc_frames = calculateFrames(bowlers[currentBowler]?.frames ?? []);
</script>

<div class="top-bar">
	<div class="lane-number">
		<h1>{laneNumber}</h1>
	</div>
	<div class="current-bowler">
		<Icon icon="ic:baseline-account-circle" width={40} height={40} />
		<div>
			<h1 class="current-bowler-text">CURRENT BOWLER</h1>
			<h1>{currentBowler}</h1>
		</div>
	</div>
	<div class="frames">
		{#each [...Array(11).keys()] as i}
			<Frame
				frame={bowlers[currentBowler]?.frames[i] ?? []}
				score={i + 1 === 11
					? calc_frames.values.reduce((acc, val) => (val && val > acc ? val : acc), 0)
					: calc_frames.values[i] ?? null}
				{currentFrame}
				frameNumber={i + 1} />
		{/each}
	</div>
	<div class="pins-background">
		<DotPins {pins} {type} />
	</div>
</div>

<style>
	/* Top bar */
	.top-bar {
		width: 100%;
		height: 110px;

		background-color: #313235;

		display: flex;
		align-items: center;
	}

	.lane-number {
		width: 100px;
		height: 100px;
		margin-bottom: 10px;

		background-color: #404244;
		border-bottom-right-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lane-number > h1 {
		font-size: 48px;
	}

	.current-bowler {
		position: relative;
		width: 400px;
		height: 90px;
		margin-left: 20px;
		padding: 10px;

		background: #28282a;
		border-radius: 10px;
		box-sizing: border-box;

		display: flex;
		align-items: center;
	}
	.current-bowler > div {
		margin-left: 10px;
	}
	.current-bowler > div > h1 {
		font-size: 28px;
	}
	.current-bowler-text {
		position: absolute;
		top: 5px;

		font-size: 16px !important;
		color: #fffa;
	}

	.frames {
		flex: 1;
		height: 100%;
		margin-left: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pins-background {
		width: 120px;
		height: 110px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
