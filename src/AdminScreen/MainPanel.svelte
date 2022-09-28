<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { Lanes, LanesData } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";

	export let lanes: Lanes;
	export let current_lane: number;

	let current_data: LanesData;
	let calc_frames: { [bowler: string]: CalcFrames } = {};
	$: {
		current_data = lanes[current_lane]?.data;
		Object.keys(current_data?.bowlers ?? {}).forEach(
			(bowler) => (calc_frames[bowler] = calculateFrames(current_data.bowlers[bowler].frames))
		);
	}
</script>

<div class="main-panel">
	{#if current_lane === 0}
		<div class="center" style="height: 100%;">
			<h1 style="color: #fff8; font-size: 26px;">Select a lane</h1>
		</div>
	{:else}
		<div class="current-lane">
			<h1>Lane {current_lane}</h1>
		</div>
		<div class="device-pins">
			<div>
				<h1 class="device">
					TV Screen:
					{#if lanes[current_lane]?.tv}
						<span class="device-connected">Connected</span>
					{:else}
						<span class="device-disconnected">Not Connected</span>
					{/if}
				</h1>
				<h1 class="device">
					User Screen:
					{#if lanes[current_lane]?.user}
						<span class="device-connected">Connected</span>
					{:else}
						<span class="device-disconnected">Not Connected</span>
					{/if}
				</h1>
			</div>
			<div>
				<DotPins pins={current_data.pins} />
			</div>
		</div>
		<div class="session">
			{#if current_data.gamesAmt === 0}
				<div class="center" style="width: 100%; height: 100%;">
					<div class="new-session">
						<h1>New session</h1>
					</div>
				</div>
			{:else}
				<h1>
					Session
					<span>
						- Game {current_data.currentGame} of {current_data.gamesAmt} - {Object.keys(
							current_data.bowlers
						).length < current_data.bowlerAmt || current_data.currentFrame === 11
							? current_data.currentGame === current_data.gamesAmt
								? "Finished"
								: "Waiting..."
							: "In progress - Frame " + current_data.currentFrame + " of 10"}
					</span>
				</h1>
				<div class="bowlers">
					<h1>Bowlers</h1>
					<div class="bowler-list">
						{#each Object.keys(current_data.bowlers ?? {}) as bowler}
							<h1 class:current-bowler={bowler === current_data.currentBowler && current_data.currentFrame < 11}>{bowler}</h1>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- {#each [...Array(11).keys()] as i}
		<Frame
			frame={current_data.bowlers[bowler]?.frames[i] ?? []}
			score={i + 1 === 11
				? calc_frames[bowler].values.reduce(
						(acc, val) => (val && val > acc ? val : acc),
						0
					)
				: calc_frames[bowler].values[i] ?? null}
			currentFrame={current_data.currentFrame}
			frameNumber={i + 1} />
	{/each} -->
<style>
	.main-panel {
		flex: 1;
		position: relative;
		padding: 20px;
		padding-top: 0;

		background-color: transparent;

		display: flex;
		flex-direction: column;
	}
	.current-lane {
		width: fit-content;
		padding: 8px 15px;
		margin-bottom: 10px;

		background-color: #313235;
		border-radius: 10px;
	}
	.current-lane > h1 {
		font-size: 28px;
	}

	.device-pins {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.device {
		font-size: 22px;
	}
	.device-connected {
		color: hsl(103, 50%, 62%);
	}
	.device-disconnected {
		color: hsl(0, 67%, 57%);
	}

	.session {
		flex: 1;
		padding: 15px;
		margin-top: 10px;

		background-color: #313235;
		border-radius: 20px;
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
	}

	.new-session {
		padding: 5px 10px;

		background-color: hsl(220deg 60% 50%);
		border-radius: 10px;
		cursor: pointer;
	}
	.new-session > h1 {
		font-size: 24px;
	}
	.new-session:hover {
		background-color: hsl(220deg 50% 55%);
	}
	.new-session:active {
		background-color: hsl(220deg 50% 45%);
	}

	.session > h1 > span {
		font-size: 24px;
		color: #fff8;
	}
	.bowlers {
		flex: 1;
		width: 500px;
		padding: 15px;
		margin-top: 10px;

		background-color: #404244;
		border-radius: 20px;
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
	}
	.bowlers > h1 {
		font-size: 28px;
	}
	.bowler-list {
		flex: 1;

		overflow-y: auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.bowler-list > h1 {
		width: fit-content;

		color: #fffa;
		font-size: 26px;
		cursor: pointer;
	}
	.bowler-list > h1:hover {
		color: #fff;
	}
	.bowler-list > h1:active {
		color: #fff8;
	}
	.current-bowler {
		color: hsl(220deg 80% 75%) !important;
	}
	.current-bowler:hover {
		color: hsl(220deg 80% 85%) !important;
	}
	.current-bowler:active {
		color: hsl(220deg 80% 65%) !important;
	}
</style>
