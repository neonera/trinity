<script lang="ts">
	import { fade } from "svelte/transition";
	import Icon from "@iconify/svelte";
	import type { BowlersType, PinsType } from "../types";
	import { calculateFrames } from "../smallFunctions";
	import Intro from "./Intro.svelte";
	import TopBar from "./TopBar.svelte";
	import RightBar from "./RightBar.svelte";
	import GameProgress from "./MainPanel/GameProgress.svelte";
	import Themes from "./MainPanel/Themes.svelte";
	import LaneChat from "./MainPanel/LaneChat.svelte";
	import Bowlers from "./MainPanel/Bowlers.svelte";
	import Stats from "./MainPanel/Stats.svelte";

	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
	export let bowlerAmt: number;
	export let gamesAmt: number;
	export let currentGame: number;
	export let startGame: (names: string[]) => any;

	export let laneNumber: number;
	export let bowlers: BowlersType;
	export let pins: PinsType;
	export let currentBowler: string;
	export let currentFrame: number;

	let mainPanelPage = "progress";
	const setPage = (page: string) => (mainPanelPage = page);

	const rankColors = ["hsl(51deg 50% 55%)", "hsl(0deg 0% 60%)", "hsl(30deg 30% 50%)"];
	let bowlersScores = {};
	let sortedScores = [];
	let bowlersRanks = {};
	$: {
		Object.keys(bowlers).forEach((bowler, i) => {
			bowlersScores[bowler] = calculateFrames(bowlers[bowler].frames).currentValue;
		});
		sortedScores = Object.keys(bowlersScores).sort((a, b) => bowlersScores[b] - bowlersScores[a]);
		sortedScores.forEach((bowler, i) => {
			if (i === 0) bowlersRanks[bowler] = 1;
			else
				bowlersRanks[bowler] =
					i > 0 && bowlersScores[bowler] === bowlersScores[sortedScores[i - 1]]
						? bowlersRanks[sortedScores[i - 1]]
						: bowlersRanks[sortedScores[i - 1]] + 1;
		});
	}
</script>

{#if Object.keys(bowlers).length === 0}
	<Intro {laneNumber} {bowlingAlleyName} {bowlingAlleyColor} {bowlerAmt} {gamesAmt} {startGame} />
{:else}
	<main style="display: flex; flex-direction: column; ">
		<TopBar {laneNumber} {bowlers} {pins} {currentBowler} {currentFrame} />
		<div style="display: flex; flex: 1;">
			<div class="main-panel">
				{#if mainPanelPage === "progress"}
					<GameProgress {bowlers} {gamesAmt} {currentGame} />
				{:else if mainPanelPage === "themes"}
					<Themes />
				{:else if mainPanelPage === "chat"}
					<LaneChat />
				{:else if mainPanelPage === "bowlers"}
					<Bowlers />
				{:else if mainPanelPage === "stats"}
					<Stats />
				{/if}
			</div>
			<RightBar {mainPanelPage} {setPage} />
		</div>
	</main>
{/if}
{#if currentFrame === 11}
	<div class="end-game-overlay" transition:fade>
		<div>
			<h1 style="margin-bottom: 10px;">Game results:</h1>
			{#each sortedScores as bowler}
				<div class="bowler-rank" style="margin-bottom: 10px;">
					<div class="place-badge" style="background-color: {rankColors[bowlersRanks[bowler] - 1] ?? 'transparent'};">
						<h1>#{bowlersRanks[bowler]}</h1>
					</div>
					<h1 style="flex: 1;">{bowler}</h1>
					<h1>{bowlersScores[bowler]}</h1>
				</div>
			{/each}
			{#if gamesAmt === currentGame}
				<h1 class="contact-front-desk">Contact the Front Desk to buy more games.</h1>
			{:else}
				<div class="start-game" on:click={() => startGame(Object.keys(bowlers))}>
					<Icon icon="ic:baseline-restart-alt" width={40} height={40} />
					<h1>Start new game</h1>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Main panel */

	.main-panel {
		flex: 1;
		padding: 40px;

		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.end-game-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		background-color: #0008;
	}
	.end-game-overlay > div {
		position: absolute;
		width: 500px;
		height: 600px;
		top: calc(50% - 300px);
		left: calc(50% - 250px);
		padding: 20px;

		background-color: #313235;
		border-radius: 20px;
		box-sizing: border-box;
	}
	.bowler-rank {
		display: flex;
		align-items: center;
	}
	.bowler-rank > h1 {
		font-size: 26px;
	}
	.place-badge {
		width: 40px;
		height: 40px;
		margin-right: 15px;

		border-radius: 20px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.place-badge > h1 {
		font-size: 20px;
		font-style: italic;
	}

	.contact-front-desk {
		position: absolute;
		width: 80%;
		left: 10%;
		bottom: 20px;

		color: #fffa;
		font-size: 28px;
		text-align: center;
	}
	.start-game {
		position: absolute;
		width: fit-content;
		bottom: 20px;
		right: 20px;
		padding: 10px 20px;

		background-color: hsl(220deg 60% 45%);
		border-radius: 100px;
		box-sizing: border-box;

		display: flex;
		align-items: center;
	}
	.start-game > h1 {
		margin-left: 10px;
	}
	.start-game:active {
		background-color: hsl(220deg 50% 55%);
	}
</style>
