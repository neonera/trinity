<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { Bowlers, Pins } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";

	export let bowlers: Bowlers;
	export let pins: Pins;
	export let currentBowler: string;
	export let currentFrame: number;

	let calc_frames: { [bowler: string]: CalcFrames } = {};
	$: Object.keys(bowlers).forEach((bowler) => (calc_frames[bowler] = calculateFrames(bowlers[bowler].frames)));
</script>

<main style="padding-top: 100px;">
	<div class="lane-number">
		<h1>27</h1>
	</div>
	<div class="pins">
		<DotPins {pins} />
	</div>
	{#each Object.keys(bowlers) as bowler, bowler_index}
		<div class="bowler-row">
			<div
				class="bowler-name"
				style={(bowler_index === 0 ? "margin-top: 30px;" : "") +
					(bowler === currentBowler ? "background-color: hsl(220deg 50% 55%);" : "")}>
				<h1 style={"width: 200px;"}>{bowler}</h1>
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
	}
</style>
