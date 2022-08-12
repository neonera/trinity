<h1>8</h1>

<style>
	h1 {
		font-style: italic;
		font-size: 60px;

		animation-name: text-animate;
		animation-duration: 3s;

		z-index: 1;
	}
	@keyframes text-animate {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		30%,
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: scale(1.2);
		}
	}
</style>
