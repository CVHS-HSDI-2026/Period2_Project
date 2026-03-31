export type SignupRecord = {
	username: string;
	password: string;
	email: string;
};

export type LoginRecord = {
	username: string;
	password: string;
}

export interface Song {
	id: number;
	title: string;
	artist: string;
	artist_mbid: string;
	album: string;
	album_mbid: string;
	rating: string;
	genre: string;
	duration: string | number;
	year: string | number;
	cover: string;
}

export type Reply = {
	id: string;
	username: string;
	text: string
};

export type CommentType = {
	id: string;
	text: string;
	replies: Reply[]
};