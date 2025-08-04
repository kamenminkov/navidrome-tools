export interface FoobarPlaybackStatistics {
	PlaybackStatistics: PlaybackStatistics;
}

export interface PlaybackStatistics {
	Entry: Entry[];
	Version: number;
	Mapping: string;
}

export interface Entry {
	Item?: ItemElement[] | ItemElement;
	AddedFriendly: string;
	Added?: bigint;
}

export interface ItemElement {
	Path: string;
}
