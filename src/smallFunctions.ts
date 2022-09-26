import type { FramesType } from "./types";

// This function was grabbed from Stack Overflow :/
export function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export type CalcFrames = { values: (number | null)[]; currentValue: number };
export function calculateFrames(frames: FramesType): CalcFrames {
	let values: CalcFrames["values"] = [];
	let currentValue: number = 0;
	frames.forEach((frame, i) => {
		let addition = 0;
		const lastVal = values[i - 1] ?? 0;

		if (frame.length === 3) {
			values[i] = lastVal + frame[0] + frame[1] + frame[2];
			currentValue += frame[0] + frame[1] + frame[2];
		} else if (frame.length === 1) {
			values[i] = null;
			currentValue += frame[0];
		} else if (frame[0] === 10) {
			const nextFrame = frames[i + 1];
			const nextFrame2 = frames[i + 2];

			if (!nextFrame || nextFrame.length < 2) {
				// Can't calculate
				values[i] = null;
				currentValue += 10 + (nextFrame?.[0] ?? 0);
			} else if (nextFrame[0] < 10) {
				// Strike
				values[i] = lastVal + 10 + nextFrame[0] + nextFrame[1];
				currentValue += 10 + nextFrame[0] + nextFrame[1];
			} else if (!nextFrame2) {
				if (i === 8 && nextFrame[1]) {
					// 9th frame strike
					values[i] = lastVal + 10 + nextFrame[0] + nextFrame[1];
					currentValue += 10 + nextFrame[0] + nextFrame[1];
				} else {
					// Maybe Double
					values[i] = null;
					currentValue += 20;
				}
			} else if (nextFrame2[0] < 10) {
				// Double
				values[i] = lastVal + 20 + nextFrame2[0];
				currentValue += 20 + nextFrame2[0];
			} else {
				// Turkey
				values[i] = lastVal + 30;
				currentValue += 30;
			}
		} else if (frame[0] + frame[1] === 10) {
			const nextFrame = frames[i + 1];
			if (nextFrame?.length > 0) {
				values[i] = lastVal + 10 + nextFrame[0];
				currentValue += 10 + nextFrame[0];
			} else {
				values[i] = null;
				currentValue += 10;
			}
		} else {
			values[i] = lastVal + frame[0] + frame[1];
			currentValue += frame[0] + frame[1];
		}
	});
	return { values, currentValue };
}
