<script lang="ts">
	import type { PinsType } from "../types";

	export let pins: PinsType;
	export let type: 10 | 9 | 5 = 10;
</script>

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

<style>
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
		transition: background-color 0.25s;
	}
	.pin9 {
		margin: 2px 8px;
	}
	.pin5 {
		margin: 4px 2px;
	}
</style>
