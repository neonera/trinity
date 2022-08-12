<h1 class="slash">/</h1>
<h1 class="text">Spare!</h1>

<style>
	.slash {
		position: absolute;

		color: #777;
		font-size: 300px;

		animation-name: slash-animate;
		animation-duration: 3s;
		animation-timing-function: cubic-bezier(0, 0.99, 1, 0.01);
	}
	.text {
		position: absolute;

		text-shadow: 0 0 30px #000a;
		font-style: italic;
		font-size: 60px;
		z-index: 1;

		animation-name: text-animate;
		animation-duration: 3s;
		animation-timing-function: linear;
	}

	@keyframes slash-animate {
		0% {
			transform: rotate(-2000deg);
		}
		100% {
			transform: rotate(2000deg);
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
