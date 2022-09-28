export type FramesType = ([number] | [number, number] | [number, number, number])[];

export type BowlersType = {
	[name: string]: { frames: FramesType };
};

export type PinsType = number[];

// Admin
export type Lanes = {
	[lane: number]: {
		tv: boolean;
		user: boolean;
		data: LanesData;
	};
};
export type LanesData = {
	bowlerAmt: number;
	gamesAmt: number;
	currentBowler: string;
	currentGame: number;
	currentFrame: number;
	past_games: BowlersType[];
	bowlers: BowlersType;
	pins: PinsType;
};