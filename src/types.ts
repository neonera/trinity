export type Frames = ([number] | [number, number] | [number, number, number])[];

export type Bowlers = {
	[name: string]: { frames: Frames };
};

export type Pins = number[];
