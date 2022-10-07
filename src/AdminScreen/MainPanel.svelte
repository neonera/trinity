<script lang="ts">
	import { calculateFrames, type CalcFrames } from "../smallFunctions";
	import type { Lanes, LanesData } from "../types";
	import Frame from "../lib/Frame.svelte";
	import DotPins from "../lib/DotPins.svelte";
	import { socket_functions } from "../App.svelte";
	import { fade } from "svelte/transition";
	import Icon from "@iconify/svelte";

	export let lanes: Lanes;
	export let current_lane: number;

	let type: string = "";
	let data: string | boolean = "";
	let creating_session_games: number = 1;
	let creating_session_bowlers: number = 1;
	let add_bowler_name: string = "";

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
					<div
						class="new-session"
						on:click={() => {
							creating_session_bowlers = 1;
							creating_session_games = 1;
							type = "create_session";
							data = false;
						}}>
						<h1>New session</h1>
					</div>
				</div>
			{:else}
				<div class="session-top">
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
					<div style="display: flex;">
						<div
							on:click={() => {
								creating_session_bowlers = lanes[current_lane].data.bowlerAmt;
								creating_session_games = lanes[current_lane].data.gamesAmt;
								type = "create_session";
								data = true;
							}}>
							<Icon icon="ic:outline-edit" class="action-icon" width={35} height={35} />
						</div>
						<div on:click={() => (type = "stop_session")}>
							<Icon icon="ic:outline-stop-circle" class="action-icon stop-icon" width={35} height={35} />
						</div>
					</div>
				</div>
				<div class="bowlers">
					<div class="bowlers-top">
						<h1>Bowlers</h1>
						<div on:click={() => (type = "add_bowler")}>
							<Icon icon="ic:outline-person-add" class="action-icon" width={30} height={30} />
						</div>
					</div>
					<div class="bowler-list">
						{#each Object.keys(current_data.bowlers ?? {}) as bowler}
							<h1
								class:current-bowler={bowler === current_data.currentBowler &&
									current_data.currentFrame < 11}
								on:click={() => {
									type = "edit_bowler";
									data = bowler;
								}}>
								{bowler}
							</h1>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
{#if type === "create_session"}
	<div class="dialog small-dialog" on:click={() => (type = "")} transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>{data ? "Edit" : "New"} session</h1>
			<div class="creating-session-flex">
				<h1>Games:</h1>
				<input
					type="number"
					class="number-input"
					bind:value={creating_session_games}
					min={data
						? lanes[current_lane].data.currentGame > 0
							? lanes[current_lane].data.currentGame.toString()
							: "1"
						: "1"} />
			</div>
			{#if !data}
				<div class="creating-session-flex">
					<h1>Bowlers:</h1>
					<input type="number" class="number-input" bind:value={creating_session_bowlers} min="1" />
				</div>
			{/if}
			<div
				style="display: flex; align-items: center; justify-content: center; margin-top: {data
					? '83'
					: '43'}px;">
				<div
					class="new-session"
					on:click={() => {
						if (!data) socket_functions.set_bowlers(current_lane, creating_session_bowlers);
						socket_functions.set_games(current_lane, creating_session_games);
						type = "";
					}}>
					<h1>{data ? "Edit" : "Start"} session</h1>
				</div>
			</div>
		</div>
	</div>
{:else if type === "stop_session"}
	<div class="dialog small-dialog" on:click={() => (type = "")} transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>Stop session</h1>
			<div style="display: flex; align-items: center; justify-content: center; margin-top: 123px;">
				<div
					class="new-session stop-session"
					on:click={() => {
						socket_functions.stop_session(current_lane);
						type = "";
					}}>
					<h1>Stop session</h1>
				</div>
			</div>
		</div>
	</div>
{:else if type === "add_bowler"}
	<div
		class="dialog small-dialog"
		on:click={() => {
			type = "";
			add_bowler_name = "";
		}}
		transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>Add bowler</h1>
			<div class="creating-session-flex">
				<h1>Name:</h1>
				<input type="text" class="text-input" bind:value={add_bowler_name} style="text-transform: uppercase;" />
			</div>
			<div style="display: flex; align-items: center; justify-content: center; margin-top: 86px;">
				{#if Object.keys(lanes[current_lane].data.bowlers).length === 0 || lanes[current_lane].data.bowlers[Object.keys(lanes[current_lane].data.bowlers)[0]].frames.length > 0}
					<h1 class="button-warning">Game needs to be started with no pins bowled</h1>
				{:else}
					<div
						class="new-session"
						on:click={() => {
							socket_functions.add_bowler(current_lane, add_bowler_name.toUpperCase());
							type = "";
							add_bowler_name = "";
						}}>
						<h1>Add bowler</h1>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else if type === "edit_bowler"}
	<div class="dialog large-dialog" on:click={() => (type = "")} transition:fade={{ duration: 200 }}>
		<div on:click={(event) => event.stopPropagation()}>
			<h1>{data}</h1>
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
	.stop-session {
		background-color: hsl(0deg 60% 50%);
	}
	.stop-session:hover {
		background-color: hsl(0deg 50% 55%);
	}
	.stop-session:active {
		background-color: hsl(0deg 50% 45%);
	}

	.session-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.session-top > h1 > span {
		font-size: 24px;
		color: #fff8;
	}
	:global(.action-icon) {
		cursor: pointer;
	}
	:global(.action-icon) > :global(path) {
		fill: hsl(0, 0%, 80%);
	}
	:global(.action-icon):hover > :global(path) {
		fill: hsl(0, 0%, 100%);
	}
	:global(.action-icon):active > :global(path) {
		fill: hsl(0, 0%, 70%);
	}
	:global(.stop-icon) > :global(path) {
		fill: hsl(0, 70%, 57%);
	}
	:global(.stop-icon):hover > :global(path) {
		fill: hsl(0, 70%, 65%);
	}
	:global(.stop-icon):active > :global(path) {
		fill: hsl(0, 70%, 52%);
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
	.bowlers-top {
		display: flex;
		/* align-items: center; */
		justify-content: space-between;
	}
	.bowlers-top > h1 {
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
	.small-dialog > div {
		width: 400px;
		height: 250px;
		top: calc(50% - 125px);
		left: calc(50% - 200px);
	}
	.large-dialog > div {
		width: 500px;
		height: 600px;
		top: calc(50% - 300px);
		left: calc(50% - 250px);
	}
	.button-warning {
		height: 43px;
		padding: 0 20%;

		color: #fffa;
		font-size: 16px;
		text-align: center;
		overflow: hidden;
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
	.text-input {
		padding: 5px 10px;

		background-color: #0004;
		font-size: 16px;
		font-family: Avenir;
		font-weight: 600;
		border: none;
		outline: none;
		border-radius: 10px;
	}
</style>
