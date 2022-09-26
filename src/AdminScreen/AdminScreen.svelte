<script lang="ts">
	export let bowlingAlleyName: string;
	export let bowlingAlleyColor: string;
</script>

<main style="display: flex; flex-direction: column; ">
	<div class="top-bar">
		<h1 class="welcome-text">
			<span style="color: {bowlingAlleyColor};">{bowlingAlleyName}</span> Admin
		</h1>
		<h1 class="trinityText">Trinity Bowling Software</h1>
	</div>
</main>

<style>
	.top-bar {
		width: 100%;
		padding: 20px;

		box-sizing: border-box;

		display: flex;
		justify-content: space-between;
	}
</style>
