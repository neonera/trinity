<script lang="ts">
	import type { Bowlers } from "../types";
	import Icon from "@iconify/svelte";
	import Keyboard from "../lib/Keyboard.svelte";

	export let laneNumber: number;
	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let bowlerAmt: number;
	export let startGame: (names: string[]) => any;

	let currentBowler: number = 1;
	let currentName: string = "";
	let names: string[] = [];

	const submitKey = (key: string) => {
		if (key === "backspace") {
			if (currentName.length > 0) currentName = currentName.slice(0, -1);
		} else if (currentName.length < 16) currentName += key;
	};

	const submitButton = () => {
		if (currentName) {
			names.push(currentName);
			currentName = "";
		    currentBowler++;
		}
		if (currentBowler > bowlerAmt) startGame(names);
	};
</script>

<main style="display: flex; flex-direction: column;">
	<div style="display: flex; align-items: center;">
		<div class="lane-number">
			<h1>{laneNumber}</h1>
		</div>
		<div style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
			<h1 class="welcome-text">
				Welcome to <span style="color: {bowlingAlleyColor};">{bowlingAlleyName}</span>.
			</h1>
			<h1 class="bowlers-amount">{bowlerAmt} bowlers</h1>
		</div>
	</div>
	<div style="margin-top: 20px; flex: 1; display: flex; flex-direction: column; align-items: center;">
		<h1>Bowler {currentBowler}/{bowlerAmt}</h1>
		<div class="center" style="flex: 1;">
			<h1 class="current-name" style={!currentName ? "color: #fff8;" : "border-color: #5c5f66;"}>
				{currentName || "Type name here"}
			</h1>
		</div>
		<Keyboard onSubmitKey={submitKey} style="margin-bottom: 20px;" />
	</div>
	<div class="submit-button" on:click={submitButton}>
		<Icon icon="ic:baseline-send" width={30} height={30} />
		<h1>Submit</h1>
	</div>
</main>

<style>
	.lane-number {
		width: 100px;
		height: 100px;
		margin-bottom: 10px;

		background-color: #313235;
		border-bottom-right-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lane-number > h1 {
		font-size: 48px;
	}

	.welcome-text {
		margin-left: 20px;
		font-size: 48px;
	}
	.bowlers-amount {
		margin-right: 20px;
		color: #fffa;
	}
	.current-name {
		border-bottom: 2px solid #404244;
		white-space: pre;
	}

	.submit-button {
		position: absolute;
		bottom: 20px;
		right: 20px;
		padding: 10px 20px;

		background-color: hsl(220deg 60% 45%);
		border-radius: 100px;

		display: flex;
		align-items: center;
	}
	.submit-button > h1 {
		margin-left: 10px;
	}
	.submit-button:active {
		background-color: hsl(220deg 50% 55%);
	}
</style>
