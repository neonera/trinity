<script lang="ts">
	import Icon from "@iconify/svelte";
	import Keyboard from "../lib/Keyboard.svelte";

	export let laneNumber: number;
	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let bowlerAmt: number;
	export let games: number;
	export let startGame: (names: string[]) => any;

	let currentBowler: number = 1;
	let editingBowler: number = -1;
	let currentName: string = "";
	let names: string[] = [];
	let error: string = "";

	const submitKey = (key: string) => {
		error = "";
		if (key === "backspace") {
			if (currentName.length > 0) currentName = currentName.slice(0, -1);
		} else if (currentName.length < 16) currentName += key;
	};

	const submitButton = () => {
		const editing = editingBowler > -1;
		if (!editing && currentBowler > bowlerAmt) startGame(names);

		if (!currentName) {
			error = "You can't have an empty name.";
		} else if (!isNaN(+currentName)) {
			error = "Your name needs at least one letter.";
		} else if (names.includes(currentName) && (!editing || names.indexOf(currentName) !== editingBowler)) {
			error = "Someone is already named that.";
		} else {
			if (editing) {
				names[editingBowler] = currentName;
				currentName = "";
				editingBowler = -1;
			} else {
				names.push(currentName);
				currentName = "";
				currentBowler++;
			}
		}
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
			<div style="display: flex; flex-direction: column; align-items: end;">
				{#if bowlerAmt > 0}
					<h1 class="bowlers-amount">{bowlerAmt} bowler{bowlerAmt === 1 ? "" : "s"}</h1>
				{/if}
				{#if games > 0}
					<h1 class="bowlers-amount">{games} game{games === 1 ? "" : "s"}</h1>
				{/if}
			</div>
		</div>
	</div>
	{#if bowlerAmt === 0}
		<div class="center" style="flex: 1; flex-direction: column;">
			<h1>Waiting for bowlers...!</h1>
			<h1 style="color: #fffa;">Buy games at the Front Desk.</h1>
		</div>
	{:else}
		{#if currentBowler > bowlerAmt && editingBowler === -1}
			<div style="margin-top: 20px; flex: 1; display: flex; flex-direction: column; align-items: center;">
				<h1>Bowler names:</h1>
				<h1 style="font-size: 24px; color: #fff8; margin-bottom: 20px;">(press any name to change it)</h1>
				{#each names as name, i}
					<div
						class="center confirm-name"
						on:click={() => {
							currentName = names[i];
							editingBowler = i;
						}}>
						<h1>{name}</h1>
					</div>
				{/each}
			</div>
		{:else}
			<div style="margin-top: 20px; flex: 1; display: flex; flex-direction: column; align-items: center;">
				<h1>
					{editingBowler > -1
						? `Editing Bowler ${editingBowler + 1}`
						: `Bowler ${currentBowler} of ${bowlerAmt}`}
				</h1>
				<div class="center" style="flex: 1;">
					<h1 class="current-name" style={!currentName ? "color: #fff8;" : "border-color: #5c5f66;"}>
						{currentName || "Type name here"}
					</h1>
				</div>
				<Keyboard onSubmitKey={submitKey} style="margin-bottom: 20px;" />
			</div>
		{/if}
		<div class="bottom-right-content">
			<h1>{error}</h1>
			<div class="submit-button" on:click={submitButton}>
				<Icon icon="ic:baseline-send" width={30} height={30} />
				<h1>{currentBowler > bowlerAmt && editingBowler === -1 ? "Start Game" : "Submit"}</h1>
			</div>
		</div>
	{/if}
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

	.confirm-name {
		width: 600px;
		height: 60px;
		margin-bottom: 10px;

		background-color: #28282a;
		border-radius: 10px;
	}
	.confirm-name:active {
		background-color: #313235;
	}

	.bottom-right-content {
		position: absolute;
		width: 253px;
		bottom: 20px;
		right: 20px;

		display: flex;
		flex-direction: column;
		align-items: end;
	}
	.bottom-right-content > h1 {
		flex: 1;
		margin-bottom: 10px;

		color: hsl(0deg 70% 60%);
		font-size: 22px;
		text-align: end;
	}
	.submit-button {
		padding: 10px 20px;

		background-color: hsl(220deg 60% 45%);
		border-radius: 100px;
		box-sizing: border-box;

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
