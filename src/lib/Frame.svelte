<script lang="ts">
	// @ts-ignore
	import type { Frames } from "../App";
	export let frame: Frames;
	export let currentFrame: number = 0;
	export let score: number | null;
	export let frameNumber: number;
	export let showFrameNumber: boolean = true;
	export let style: string = "";
	export let tvSize: boolean = false;
	export let hide: boolean = false;

	let firstScore = "";
	let secondScore = "";
	let thirdScore = "";

	let framesTextStyle = "";
	let scoreTextStyle = "";

	$: {
		if (tvSize) {
			framesTextStyle = "font-size: 22px;";
			scoreTextStyle = "font-size: 34px;";
		} else {
			framesTextStyle = "";
			scoreTextStyle = "";
		}
		if (hide) {
			framesTextStyle += "color: #fff6;";
			scoreTextStyle += "color: #fffc;";
		}

		if (frameNumber === 10) {
			if (frame.length < 1) firstScore = "";
			else if (frame[0] === 10) firstScore = "X";
			else if (frame[0] === 0) firstScore = "-";
			else firstScore = frame[0];

			if (frame.length < 2) secondScore = "";
			else if (frame[1] === 10) secondScore = "X";
			else if (frame[1] === 0) secondScore = "-";
			else if (frame[0] + frame[1] === 10) secondScore = "/";
			else secondScore = frame[1];

			if (frame.length < 3) thirdScore = "";
			else if (frame[2] === 10) thirdScore = "X";
			else if (frame[2] === 0) thirdScore = "-";
			else if (frame[0] === 10 && frame[1] + frame[2] === 10) thirdScore = "/";
			else thirdScore = frame[2];
		} else {
			if (frame.length < 1 || frame[0] === 10) firstScore = "";
			else if (frame[0] === 0) firstScore = "-";
			else firstScore = frame[0];

			if (frame.length < 2) secondScore = "";
			else if (frame[0] === 10) secondScore = "X";
			else if (frame[0] + frame[1] === 10) secondScore = "/";
			else if (frame[1] === 0) secondScore = "-";
			else secondScore = frame[1];
		}
	}
</script>

<div
	class="frame"
	style={(frameNumber === 11 ? "margin-right: 10px;" : "") + style + (hide ? "background-color: #222325;" : "")}>
	{#if showFrameNumber}
		<div
			class="frame-number"
			style={(currentFrame === frameNumber ? "background-color: hsl(0deg 50% 50%);" : "") +
				(tvSize ? "height: 30px;" : "")}>
			<h1 style={tvSize ? "font-size: 20px;" : ""}>{frameNumber === 11 ? "TOTAL" : frameNumber}</h1>
		</div>
	{/if}
	{#if frameNumber < 11}
		<div class="frame-scores" style="height: 30px;">
			<div class="frame-score" style={tvSize ? "height: 30px" : ""}>
				<h1 style={framesTextStyle}>{firstScore}</h1>
			</div>
			<div
				class="frame-score"
				style={`background: ${hide ? "#2C2D30" : "#404244"}; border-bottom-left-radius: 5px;` +
					(frameNumber === 10 || showFrameNumber ? "" : "border-top-right-radius: 10px;") +
					(tvSize ? "height: 30px" : "")}>
				<h1 style={framesTextStyle}>
					{secondScore}
				</h1>
			</div>
			{#if frameNumber === 10}
				<div
					class="frame-score"
					style={`background: ${hide ? "#2C2D30" : "#404244"};` +
						(showFrameNumber ? "" : "border-top-right-radius: 10px;") +
					(tvSize ? "height: 30px" : "")}>
					<h1 style={framesTextStyle}>
						{thirdScore}
					</h1>
				</div>
			{/if}
		</div>
	{/if}
	<div class="current-score">
		<h1 style={scoreTextStyle}>{score === null ? "" : score === 0 && frameNumber < 11 ? "—" : score}</h1>
	</div>
</div>

<style>
	.frame {
		flex: 1;
		height: 80px;
		margin-left: 10px;

		border-radius: 10px;
		background-color: #28282a;
		transition: background-color 0.5s;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.frame-number {
		width: 100%;
		height: 20px;

		background-color: hsl(0deg 60% 63%);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		transition: background-color 0.5s;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.frame-number > h1 {
		font-size: 15px;
	}

	.frame-scores {
		width: 100%;
		height: 25px;

		display: flex;
	}
	.frame-score {
		flex: 1;
		height: 25px;
		transition: background-color 0.5s;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.frame-score > h1 {
		color: #fffa;
		font-size: 18px;
		transition: color 0.5s;
	}

	.current-score {
		flex: 1;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.current-score > h1 {
		font-size: 24px;
		transition: color 0.5s;
	}
</style>
