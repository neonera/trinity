<div class="dots">
	<div />
	<div class="dot2" />
</div>
<h1>8</h1>

<style>
	.dots {
		position: absolute;
		width: 30px;
		height: 30px;

		animation-name: dots-animate;
		animation-duration: 1s;
		animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);

		display: flex;
	}
	.dots > div {
		position: absolute;
		width: 30px;
		height: 30px;

		background-color: white;
		border-radius: 20px;
		transform: translateY(15px);
		opacity: 0;

		animation-name: dot-animate;
		animation-duration: 1.5s;
	}
	.dot2 {
		transform: translateY(-15px) !important;
		animation-name: dot2-animate !important;
	}

	h1 {
		font-style: italic;
		font-size: 60px;
		opacity: 0;
		z-index: 1;

		animation-name: text-animate;
		animation-duration: 2s;
		animation-delay: 1s;
	}
	@keyframes dots-animate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(1080deg);
		}
	}
	@keyframes dot-animate {
		0% {
			transform: translateY(240px);
			opacity: 1;
		}
		80% {
			transform: translateY(15px);
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes dot2-animate {
		0% {
			transform: translateY(-240px);
			opacity: 1;
		}
		80% {
			transform: translateY(-15px);
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
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
