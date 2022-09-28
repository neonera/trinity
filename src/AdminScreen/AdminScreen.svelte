<script lang="ts">
	import type { Lanes } from "src/types";
	import MainPanel from "./MainPanel.svelte";

	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let lanes: Lanes;

	let current_lane = 0;
</script>

<main style="display: flex; flex-direction: column; ">
	<div class="top-bar">
		<h1 class="welcome-text">
			<span style="color: {bowlingAlleyColor};">{bowlingAlleyName}</span> Admin
		</h1>
		<h1 class="trinityText">Trinity Bowling Software</h1>
	</div>
	<div class="content">
		<div class="left-panel">
			{#each Object.keys(lanes) as lane}
				<div
					class="lane-button"
					class:lane-button-selected={+lane === current_lane}
					on:click={() => (current_lane = +lane)}>
					<h1>Lane {lane}</h1>
				</div>
			{/each}
		</div>
		<MainPanel {lanes} {current_lane} />
	</div>
</main>

<style>
	.top-bar {
		width: 100%;
		padding: 20px;

		box-sizing: border-box;

		display: flex;
		justify-content: space-between;
	}

	.content {
		flex: 1;

		display: flex;
		overflow: hidden;
	}
	.left-panel {
		width: 280px;
		height: 100%;
		padding: 15px;
		/* padding-top: 55px; */

		background-color: #28282a;
		border-top-right-radius: 20px;
		box-sizing: border-box;
		overflow-y: auto;
	}
	.lane-button {
		padding: 9px 15px;
		margin-bottom: 3px;

		border-radius: 10px;
		cursor: pointer;
	}
	.lane-button:hover {
		background-color: #313235;
	}
	.lane-button:active {
		background-color: #0002;
	}
	.lane-button-selected {
		background-color: #404244;
	}
	.lane-button-selected:hover {
		background-color: #404244;
	}
	.lane-button > h1 {
		color: #fff8;
		font-size: 22px;
		transition: transform 0.1s, color 0.1s;
	}
	.lane-button-selected > h1 {
		color: #fff;
		transform: translateX(10px);
	}
</style>
