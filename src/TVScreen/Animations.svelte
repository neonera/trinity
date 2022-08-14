<script lang="ts">
	import { tweened } from "svelte/motion";
	import standard from "./Standard/standard";

	export let animate: string | number;
	export let updater: number;

	let finished: boolean = true;
	let lastUpdater: number = updater;
	const opacity = tweened(0, {
		duration: 500,
	});

	$: {
		if (updater !== lastUpdater) {
			lastUpdater = updater;
			finished = false;
			opacity.set(1).then(() => setTimeout(() => opacity.set(2).then(() => (finished = true)), 2000));
		}
	}

	const animationComponents: { [key: string | number]: any } = standard;
</script>

<!-- Turned off because they are annoying -->
<div class="animations" style={finished || true ? "display: none;" : `opacity: ${1 - Math.abs($opacity - 1)};`}>
	{#if !finished}
		<svelte:component this={animationComponents[animate]} />
	{/if}
</div>

<style>
	.animations {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		background-color: #0008;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
