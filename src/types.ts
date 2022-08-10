export type Frames = ([number] | [number, number] | [number, number, number])[];

export type Bowlers = {
	[name: string]: { score: number; frames: Frames };
};

export type Pins = number[];
