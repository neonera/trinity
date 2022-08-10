<script lang="ts">
	import type { Bowlers, Pins } from "./types";
	import UserScreen from "./UserScreen/UserScreen.svelte";

	const screenType = "user";

	// prettier-ignore
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

{#if screenType === "user"}
	<UserScreen {bowlers} {pins} {currentBowler} {currentFrame} />
{:else if screenType === "tv"}
	<UserScreen {bowlers} {pins} {currentBowler} {currentFrame} /> <!-- This should be changed to a TVScreen -->
{/if}
