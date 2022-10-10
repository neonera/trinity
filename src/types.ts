export type FramesType = ([number] | [number, number] | [number, number, number])[];

export type BowlersType = {
	[name: string]: { frames: FramesType };
};

export type PinsType = number[];

// TESTING NEW ARC

const bowlers = [{ name: "Bruh" }, { name: "ay", deleted: true }, { name: "K" }];
const frames = [
	[
		[10, 0],
		[8, 1],
	],
	[[9, 0]],
];
const pastGames = [
	[
		[
			[8, 0],
			[6, 1],
		],
		[[5, 4]],
	],
	[
		[
			[6, 2],
			[6, 3],
		],
		[[10, 0]],
	],
];

// Admin
export type Lanes = {
	[lane: number]: {
		tv: boolean;
		user: boolean;
		data: LanesData;
	};
};

export type LanesData = {
	bowlersAmt: number;
	gamesAmt: number;
	currentBowler: string;
	currentGame: number;
	currentFrame: number;
	bowlers: BowlersType;
	pastGames: BowlersType[];
	pins: PinsType;
};
