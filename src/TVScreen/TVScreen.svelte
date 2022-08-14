<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { BowlersType, FramesType, PinsType } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";
	import Animations from "./Animations.svelte";

	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let bowlerAmt: number;
	export let games: number;

	export let laneNumber: number;
	export let bowlers: BowlersType;
	export let pins: PinsType;
	export let currentBowler: string;
	export let currentFrame: number;

	let calc_frames: { [bowler: string]: CalcFrames } = {};
	let animate: string | number = "";
	let updater = 0;
	let nextAnimate: string = currentBowler;
	let nextAnimateFrames: FramesType = bowlers[currentBowler]?.frames.slice();
	$: {
		Object.keys(bowlers).forEach((bowler) => (calc_frames[bowler] = calculateFrames(bowlers[bowler].frames)));
		const theseFrames = bowlers[nextAnimate]?.frames;
		if (nextAnimateFrames != theseFrames) {
			const last_frame = theseFrames.at(-1);
			if (last_frame) {
				if (theseFrames.length < 10) {
					if (last_frame[0] === 10) {
						animate = "strike";
					} else if (last_frame[0] + last_frame[1] === 10) {
						animate = "spare";
					} else animate = last_frame.at(-1);
				} else {
					if (last_frame.at(-1) === 10) {
						animate = "strike";
					} else if (
						last_frame.length > 1 &&
						last_frame[0] < 10 &&
						last_frame.at(-2) + last_frame.at(-1) === 10
					) {
						animate = "spare";
					} else animate = last_frame.at(-1);
				}
				updater++;
			}
		}
		if (currentBowler !== nextAnimate) {
			nextAnimate = currentBowler;
			nextAnimateFrames = bowlers[currentBowler]?.frames.slice();
		}
	}
</script>

<main style={Object.keys(bowlers).length > 0 ? "padding-top: 100px;" : ""}>
	<div class="lane-number">
		<h1>{laneNumber}</h1>
	</div>
	{#if currentFrame === 11}
		<h1 class="end-game-text">Waiting for input on touchscreen...</h1>
	{/if}
	{#if Object.keys(bowlers).length === 0}
		{#if bowlerAmt > 0}
			<h1 style="position: absolute; top: 20px; right: 20px;">{bowlerAmt} bowler{bowlerAmt === 1 ? "" : "s"}</h1>
		{/if}
		{#if games > 0}
			<h1 style="position: absolute; top: 60px; right: 20px;">{games} game{games === 1 ? "" : "s"}</h1>
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
<Animations {animate} {updater} />

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
	.end-game-text {
		position: absolute;
		width: 600px;
		top: 30px;
		left: calc(50% - 300px);

		color: #fffa;
		text-align: center;
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
		margin: 0 15px;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
