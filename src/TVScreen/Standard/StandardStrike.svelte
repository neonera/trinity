<script lang="ts">
    const blue_fast = [[23, 21], [20, 12], [17, 30], [38, 22], [50, 18], [0, 20], [47, 28], [5, 15], [45, 14]];
    const red_fast = [[27, 25], [35, 16], [15, 18], [56, 26], [4, 28], [35, 35], [65, 20]];
    const blue_slow = [[19, 17], [6, 25], [33, 33], [6, 16], [60, 23]];
    const red_slow = [[23, 10], [44, 20], [58, 15], [3, 12]];
</script>

<div class="strike">
    {#each blue_fast as pos}
	    <div class="blue fast" style="left: {pos[0]}0px; top: {pos[1]}0px;" />
    {/each}
    {#each red_fast as pos}
	    <div class="red fast" style="left: {pos[0]}0px; top: {pos[1]}0px;" />
    {/each}
    {#each blue_slow as pos}
	    <div class="blue slow" style="left: {pos[0]}0px; top: {pos[1]}0px;" />
    {/each}
    {#each red_slow as pos}
	    <div class="red slow" style="left: {pos[0]}0px; top: {pos[1]}0px;" />
    {/each}

	<h1>STRIKE!</h1>
</div>

<style>
	.strike {
		position: relative;
		width: 700px;
		height: 500px;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	h1 {
		font-style: italic;
		font-size: 60px;

		animation-name: text-animate;
		animation-duration: 3s;
		animation-timing-function: cubic-bezier(0, 0.7, 1, 0.3);

        z-index: 2;
	}

	.blue {
        position: absolute;
		width: 50px;
		height: 4px;

		background-color: #7a7ae5;
        z-index: 1;
	}
	.red {
        position: absolute;
		width: 50px;
		height: 4px;

		background-color: #e57a7a;
        z-index: 1;
	}
	.slow {
        filter: brightness(0.7);
        
		animation-name: slow-animate;
		animation-duration: 3s;
        animation-timing-function: linear;
	}
	.fast {
		animation-name: fast-animate;
		animation-duration: 3s;
        animation-timing-function: linear;
	}

	@keyframes text-animate {
		0% {
			transform: translateX(-40px);
		}
		100% {
			transform: translateX(40px);
		}
	}
	@keyframes slow-animate {
		0% {
			transform: translateX(-20px);
		}
		100% {
			transform: translateX(20px);
		}
	}
	@keyframes fast-animate {
		0% {
			transform: translateX(-70px);
		}
		100% {
			transform: translateX(70px);
		}
	}
</style>
