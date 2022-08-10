<script lang="ts">
	import isDarkColor from "is-dark-color";

	export let value: number;
	export let maxValue: number = 100;
	export let width: number = 100;
	export let height: number = 50;
	export let background: string = "#000000";
	export let foreground: string = "#ffffff";
	export let style: string = "";
	export let barStyle: string = "";

	let containerWidth: number;
	let barWidth: number;
	let textWidth: number;

	let showTextInside = false;
	$: showTextInside = containerWidth - barWidth <= textWidth + 20;
</script>

<div
	class="container"
	style="width: {width}px; height: {height}px; background-color: {background}; {style}"
	bind:clientWidth={containerWidth}>
	<div
		class="bar"
		style="width: {(value / maxValue) * 100}%; background-color: {foreground} {barStyle}"
		bind:clientWidth={barWidth} />
	<div
		class="text-div"
		style="{showTextInside ? 'right' : 'left'}: {showTextInside
			? containerWidth - (value / maxValue) * containerWidth
			: (value / maxValue) * containerWidth}px;"
		bind:clientWidth={textWidth}>
		<h1 style="color: {showTextInside && !isDarkColor(foreground) ? 'white' : 'white'};">{value}</h1>
	</div>
</div>

<style>
	.container {
		position: relative;

		border-radius: 10px;
		overflow: hidden;
	}
	.bar {
		height: 100%;
	}
	.text-div {
		position: absolute;
		top: 0;
		height: 100%;
		margin: 0 8px;

		display: flex;
		align-items: center;
	}
</style>
