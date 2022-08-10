<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { Bowlers, Pins } from "./types";
	import { calculateFrames, type CalcFrames } from "./smallFunctions";
	import Frame from "./TopBar/Frame.svelte";

	export let bowlers: Bowlers;
	export let pins: Pins;
	export let type: 10 | 9 | 5 = 10;
	export let currentBowler: string;
	export let currentFrame: number;

	let calc_frames: CalcFrames = { values: [], currentValue: 0 };
	$: calc_frames = calculateFrames(bowlers[currentBowler].frames);
</script>

<div class="top-bar">
	<div class="lane-number">
		<h1>27</h1>
	</div>
	<div class="current-bowler">
		<Icon icon="ic:baseline-account-circle" width={40} height={40} />
		<div>
			<h1 class="current-bowler-text">CURRENT BOWLER</h1>
			<h1>{currentBowler}</h1>
		</div>
	</div>
	<div class="frames">
		{#each calc_frames.values as score, i}
			<Frame frame={bowlers[currentBowler].frames[i]} {currentFrame} {score} frameNumber={i + 1} />
		{/each}
		{#each [...Array(11 - calc_frames.values.length).keys()] as i}
			<Frame
				frame={[]}
				score={i + calc_frames.values.length + 1 === 11
					? calc_frames.values.reduce((acc, val) => (val && val > acc ? val : acc))
					: null}
				frameNumber={i + calc_frames.values.length + 1} />
		{/each}
	</div>
	<div class="pins-background">
		<div class="pins">
			{#if type === 10}
				<div style="display: flex;">
					<div class="pin" style="background-color: {pins.includes(0) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(1) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(2) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(3) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin" style="background-color: {pins.includes(4) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(5) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(6) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin" style="background-color: {pins.includes(7) ? 'white' : '#fff5'};" />
					<div class="pin" style="background-color: {pins.includes(8) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin" style="background-color: {pins.includes(9) ? 'white' : '#fff5'};" />
				</div>
			{:else if type === 9}
				<div style="display: flex;">
					<div class="pin pin9" style="background-color: {pins.includes(0) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin9" style="background-color: {pins.includes(1) ? 'white' : '#fff5'};" />
					<div class="pin pin9" style="background-color: {pins.includes(2) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin9" style="background-color: {pins.includes(3) ? 'white' : '#fff5'};" />
					<div class="pin pin9" style="background-color: {pins.includes(4) ? '#f88' : '#f885'};" />
					<div class="pin pin9" style="background-color: {pins.includes(5) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin9" style="background-color: {pins.includes(6) ? 'white' : '#fff5'};" />
					<div class="pin pin9" style="background-color: {pins.includes(7) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin9" style="background-color: {pins.includes(8) ? 'white' : '#fff5'};" />
				</div>
			{:else if type === 5}
				<div style="display: flex;">
					<div class="pin pin5" style="background-color: {pins.includes(0) ? 'white' : '#fff5'};" />
					<div class="pin pin5" style="background-color: transparent;" />
					<div class="pin pin5" style="background-color: transparent;" />
					<div class="pin pin5" style="background-color: transparent;" />
					<div class="pin pin5" style="background-color: {pins.includes(1) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin5" style="background-color: {pins.includes(2) ? 'white' : '#fff5'};" />
					<div class="pin pin5" style="background-color: transparent;" />
					<div class="pin pin5" style="background-color: {pins.includes(3) ? 'white' : '#fff5'};" />
				</div>
				<div style="display: flex;">
					<div class="pin pin5" style="background-color: {pins.includes(4) ? 'white' : '#fff5'};" />
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Top bar */
	.top-bar {
		width: 100%;
		height: 110px;

		background-color: #313235;

		display: flex;
		align-items: center;
	}

	.lane-number {
		width: 100px;
		height: 100px;
		top: 0;
		left: 0;
		margin-bottom: 10px;

		background-color: #404244;
		border-bottom-right-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lane-number > h1 {
		font-size: 48px;
	}

	.current-bowler {
		position: relative;
		width: 400px;
		height: 90px;
		margin-left: 20px;
		padding: 10px;

		background: #28282a;
		border-radius: 10px;
		box-sizing: border-box;

		display: flex;
		align-items: center;
	}
	.current-bowler > div {
		margin-left: 10px;
	}
	.current-bowler > div > h1 {
		font-size: 28px;
	}
	.current-bowler-text {
		position: absolute;
		top: 5px;

		font-size: 16px !important;
		color: #fffa;
	}

	.frames {
		flex: 1;
		height: 100%;
		margin-left: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pins-background {
		width: 120px;
		height: 110px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pins {
		width: 80px;
		height: 80px;

		background-color: #28282a;
		border-radius: 10px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.pin {
		width: 10px;
		height: 10px;
		margin: 2px 3px;

		background-color: #fff;
		border-radius: 5px;
	}
	.pin9 {
		margin: 2px 8px;
	}
	.pin5 {
		margin: 4px 2px;
	}
</style>
