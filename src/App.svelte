<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { Bowlers, Pins } from "./types";
	import GameProgress from "./MainPanel/GameProgress.svelte";
	import TopBar from "./TopBar.svelte";

	const bowlers: Bowlers = {
		DOM: /*    */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 7], [5, 0], [5, 1]] },
		JAYDEN: /* */ { frames: [[9, 0], [3, 4], [7, 1], [10, 0], [1, 9], [4, 1], [10, 0]] },
		AJ: /*     */ { frames: [[7, 0], [3, 4], [7, 1], [10, 0], [0, 9], [5, 0], [9]] },
		LOS34: /*  */ { frames: [[7, 2], [3, 6], [7, 1], [10, 0], [0, 9], [5, 0]] },
		EVERETT: /**/ { frames: [[1, 0], [0, 2], [3, 1], [4, 0], [0, 5], [4, 0]] },
	};
	const pins: Pins = [5];
	let currentBowler = "AJ";
	const currentFrame = 7;
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
