<script lang="ts">
	import Icon from "@iconify/svelte";

	export let mainPanelPage: string;
	export let setPage: (page: string) => any;

	const options = {
		progress: { icon: "ic:baseline-watch-later", title: "Game Progress" },
		themes: { icon: "mdi:palette", title: "Themes" },
		chat: { icon: "mdi:forum", title: "Lane Chat" },
		bowlers: { icon: "ic:baseline-people", title: "Bowlers" },
		stats: { icon: "ic:baseline-bar-chart", title: "Stats" },
	};
</script>

<div class="right-bar">
	{#each Object.keys(options) as option}
		<div
			class="option {option} {mainPanelPage === option ? option + '-selected' : ''}"
			on:mousedown={() => setPage(option)}>
			<Icon icon={options[option].icon} width={40} height={40} />
			<h1 style={option === "progress" ? "font-size: 24px;" : ""}>{options[option].title}</h1>
		</div>
	{/each}
</div>

<style>
	.right-bar {
		width: 300px;

		background-color: #28282a;
	}
	.option {
		height: 100px;
		padding-left: 30px;
		margin: 10px;

		background-color: #313235;
		border-radius: 10px;
		box-sizing: border-box;

		display: flex;
		align-items: center;
	}
	.option > h1 {
		margin-left: 10px;

		font-size: 28px;
	}
	.progress-selected,
	.progress:active {
		background-color: hsl(220deg 20% 30%);
	}
	.themes-selected,
	.themes:active {
		background-color: hsl(0deg 20% 30%);
	}
	.chat-selected,
	.chat:active {
		background-color: hsl(120deg 20% 30%);
	}
	.bowlers-selected,
	.bowlers:active {
		background-color: hsl(250deg 20% 30%);
	}
	.stats-selected,
	.stats:active {
		background-color: hsl(30deg 20% 30%);
	}
</style>
