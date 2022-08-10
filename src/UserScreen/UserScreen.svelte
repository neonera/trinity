<script lang="ts">
	import type { Bowlers, Pins } from "../types";
	import GameProgress from "./MainPanel/GameProgress.svelte";
	import TopBar from "./TopBar.svelte";

	export let bowlers: Bowlers;
	export let pins: Pins;
	export let currentBowler: string;
	export let currentFrame: number;
</script>

<main style="display: flex; flex-direction: column; ">
	<TopBar {bowlers} {pins} {currentBowler} {currentFrame} />
	<div style="display: flex; flex: 1;">
		<div class="main-panel">
			<GameProgress {bowlers} />
		</div>
		<div class="right-bar" />
	</div>
</main>

<style>
	/* Main panel */

	.main-panel {
		flex: 1;
		padding: 40px;

		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* Right bar */

	.right-bar {
		width: 300px;

		background-color: #28282a;
	}
</style>
