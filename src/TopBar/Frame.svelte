<script lang="ts">
	// @ts-ignore
	import type { Frames } from "../App";
	export let frame: Frames;
    export let currentFrame: number = 0;
	export let score: number | null;
	export let frameNumber: number;
</script>

<div class="frame" style={frameNumber === 11 ? "margin-right: 10px;" : ""}>
    <div class="frame-number" style={currentFrame === frameNumber ? "background-color: hsl(0deg 50% 50%);" : ""}>
        <h1>{frameNumber === 11 ? "TOTAL" : frameNumber}</h1>
    </div>
	{#if frameNumber < 11}
		<div class="frame-scores">
			<div class="frame-score">
				<h1>
					{frame.length < 1 || frame[0] === 10 ? "" : frame[0] === 0 ? "-" : frame[0]}
				</h1>
			</div>
			<div class="frame-score" style="background: #404244; border-bottom-left-radius: 5px;">
				<h1>
					{frame.length < 2
						? ""
						: frame[0] === 10
						? "X"
						: frame[0] + frame[1] === 10
						? "/"
						: frame[1] === 0
						? "-"
						: frame[1]}
				</h1>
			</div>
		</div>
	{/if}
	<div class="current-score">
		<h1>{score === null ? "" : score === 0 ? "—" : score}</h1>
	</div>
</div>

<style>
	.frame {
		flex: 1;
		height: 80px;
		margin-left: 10px;

		border-radius: 10px;
		background-color: #28282a;

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
		width: 50%;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.frame-score > h1 {
		color: #fff8;
		font-size: 18px;
	}

	.current-score {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.current-score > h1 {
		font-size: 24px;
	}
</style>
