export interface NavidromeAlbum {
	id: string;
	name: string;
	embed_art_path: string;
	album_artist: string;
	min_year: number;
	max_year: number;
	compilation: number;
	song_count: number;
	duration: number;
	genre: string;
	created_at: Date;
	updated_at: Date;
	full_text: string;
	album_artist_id: string;
	size: number;
	description: string;
	small_image_url: string;
	medium_image_url: string;
	large_image_url: string;
	external_url: string;
	external_info_updated_at: null;
	date: string;
	min_original_year: number;
	max_original_year: number;
	original_date: string;
	release_date: string;
	releases: number;
	order_album_name: string;
	order_album_artist_name: string;
	sort_album_name: string;
	sort_album_artist_name: string;
	catalog_num: string;
	comment: string;
	mbz_album_id: string;
	mbz_album_artist_id: string;
	mbz_album_type: string;
	mbz_album_comment: string;
	discs: string;
	library_id: number;
	imported_at: Date;
	missing: number;
	mbz_release_group_id: string;
	tags: string;
	participants: string;
	folder_ids: string;
	explicit_status: string;
}

export interface NavidromeMediaFile {
	Item: Item;
	AddedFriendly: Date;
	Added?: BigInt;
}

export interface Item {
	Path: string;
}
