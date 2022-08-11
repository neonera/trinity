<script lang="ts">
	import Icon from "@iconify/svelte";

	export let onSubmitKey: (key: string) => any = (key: string) => null;
	export let style: string = "";

	const staggered_rows = [
		["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace"],
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L", "1/4"],
		["Z", "X", "C", "V", "B", "N", "M", "3/4"],
		["1/4", " "],
	];
	const rows = [
		["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace"],
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M"],
		[" "],
	];
</script>

<div class="keyboard" {style}>
	{#each rows as row}
		<div class="row">
			{#each row as key}
				{#if key.includes("/") && key.length >= 3}
					<div style="width: {90 * (+key.split("/")[0] / +key.split("/")[1]) * 2}px;" />
				{:else}
					<div class="key" style={key === " " ? "width: 440px;" : ""} on:click={() => onSubmitKey(key)}>
						{#if key === "backspace"}
							<div><Icon icon="ic:baseline-backspace" width={35} height={35} /></div>
						{:else if key === " "}
							<div><Icon icon="ic:baseline-space-bar" width={60} height={60} /></div>
						{:else}
							<h1>{key}</h1>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.keyboard {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.row {
		display: flex;
	}
	.key {
		width: 80px;
		height: 80px;
		margin: 5px;

		background-color: #28282a;
		border-radius: 10px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.key > h1 {
		color: #fffd;
		font-size: 40px;
		user-select: none;
	}
	.key:active {
		background-color: #313235;
	}
	.key:active > h1 {
		color: #fff;
	}
</style>
