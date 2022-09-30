<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { Lanes, LanesData } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";
	import { socket_functions } from "../App.svelte";
	import { fade } from "svelte/transition";

	export let lanes: Lanes;
	export let current_lane: number;

	let creating_session: boolean = false;
	let edit_bowler: string = "";
	let creating_session_games: number = 1;
	let creating_session_bowlers: number = 1;

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
					<div class="new-session" on:click={() => (creating_session = true)}>
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
							<h1
								class:current-bowler={bowler === current_data.currentBowler &&
									current_data.currentFrame < 11}
								on:click={() => (edit_bowler = bowler)}>
								{bowler}
							</h1>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
{#if creating_session}
	<div
		class="dialog creating-session"
		on:click={() => (creating_session = false)}
		transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>New session</h1>
			<div class="creating-session-flex">
				<h1>Games:</h1>
				<input type="number" class="number-input" bind:value={creating_session_games} min="1" />
			</div>
			<div class="creating-session-flex">
				<h1>Bowlers:</h1>
				<input type="number" class="number-input" bind:value={creating_session_bowlers} min="1" />
			</div>
			<div style="display: flex; align-items: center; justify-content: center; margin-top: 93px;">
				<div
					class="new-session"
					on:click={() => {
						socket_functions.set_bowlers(current_lane, creating_session_bowlers);
						socket_functions.set_games(current_lane, creating_session_games);
						creating_session = false;
					}}>
					<h1>Start session</h1>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if edit_bowler !== ""}
	<div class="dialog edit-bowler" on:click={() => (edit_bowler = "")} transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>{edit_bowler}</h1>
		</div>
	</div>
{/if}

<!-- {#each [...Array(11).keys()] as i}
	<Frame
		frame={current_data.bowlers[bowler]?.frames[i] ?? []}
		score={i + 1 === 11
			? calc_frames[bowler].values.reduce((acc, val) => (val && val > acc ? val : acc), 0)
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

	.dialog {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		background-color: #0008;
	}
	.dialog > div {
		position: absolute;
		padding: 20px;

		background-color: #313235;
		border-radius: 20px;
		box-sizing: border-box;
	}
	.edit-bowler > div {
		width: 500px;
		height: 600px;
		top: calc(50% - 300px);
		left: calc(50% - 250px);
	}
	.creating-session > div {
		width: 400px;
		height: 300px;
		top: calc(50% - 150px);
		left: calc(50% - 200px);
	}

	.creating-session-flex {
		margin-top: 5px;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.creating-session-flex > h1 {
		font-size: 22px;
	}
	.number-input {
		width: 70px;
		height: 35px;
		padding: 10px;

		background-color: #0004;
		font-size: 18px;
		font-family: Avenir;
		font-weight: 600;
		border: none;
		outline: none;
		border-radius: 10px;
		box-sizing: border-box;
	}
</style>
