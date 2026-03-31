import * as SecureStore from 'expo-secure-store';
import { LoginRecord, SignupRecord } from "@/services/records";
// todo: use Expo's env vars for this in production; smth like process.env.EXPO_PUBLIC_API_URL
const BASE_URL = 'http://localhost:5000';

export const getAuthToken = async () => {
	return await SecureStore.getItemAsync('userToken');
}

export const signUp = async (signup: SignupRecord) => {
	try {
		const response = await fetch(`${BASE_URL}/api/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(signup)
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Signup failed");

		return true;
	} catch (error) {
		console.error('API Error (registering):', error);
		throw error;
	}
}

export const login = async (loginData: LoginRecord) => {
	try {
		const response = await fetch(`${BASE_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData)
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Login failed");

		if (data.token) {
			await SecureStore.setItemAsync('userToken', data.token);
			await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
		}

		return true;
	} catch (error) {
		console.error('API Error (logging in):', error);
		throw error;
	}
}

export const fetchSearchResults = async (query: string, type: string = 'all', limit: number = 10) => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/search?query=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${await response.json()}`);
		}
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchSearchResults):', error);
		throw error;
	}
};

export const fetchSongDetails = async (mbid: string) => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/song/${mbid}`);
		if (!response.ok) throw new Error(`Failed to fetch song: ${await response.json()}`);
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchSongDetails):', error);
		throw error;
	}
}

export const fetchSongReviews = async (songId: number) => {
	try {
		const response = await fetch(`${BASE_URL}/api/reviews/song/${songId}`);
		if (!response.ok) throw new Error("Failed to fetch reviews");
		const data = await response.json();
		// If the backend returns a message instead of an array (e.g., "No reviews found"), return empty array
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error('API Error (fetchSongReviews):', error);
		return [];
	}
};

export const postReview = async (songId: number, reviewText: string, rating: number = 0) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/reviews/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				song_id: songId,
				album_id: null,
				rating: rating,
				review_text: reviewText
			})
		});
		if (!response.ok) throw new Error("Failed to post review");
		return true;
	} catch (error) {
		console.error('API Error (postReview):', error);
		throw error;
	}
};

export const postReply = async (reviewId: number, text: string) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}/reply`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ content: text })
		});
		if (!response.ok) throw new Error("Failed to post reply");
		return true;
	} catch (error) {
		console.error('API Error (postReply):', error);
		throw error;
	}
};

export const favoriteSong = async (songId: number, rank: number = 1) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/users/favorite/song`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ song_id: songId, rank: rank })
		});
		if (!response.ok) throw new Error("Failed to favorite song");
		return true;
	} catch (error) {
		console.error('API Error (favoriteSong):', error);
		throw error;
	}
};

export const fetchAlbumDetails = async (mbid: string) => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/album/${mbid}`);
		if (!response.ok) throw new Error(`Failed to fetch album: ${await response.json()}`);
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchAlbumDetails):', error);
		throw error;
	}
};

export const fetchArtistDetails = async (mbid: string) => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/artist/${mbid}`);
		if (!response.ok) throw new Error("Failed to fetch artist");
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchArtistDetails):', error);
		throw error;
	}
};

export const fetchProfile = async (username: string) => {
	try {
		const response = await fetch(`${BASE_URL}/api/users/${username}`);
		if (!response.ok) throw new Error(`Failed to fetch profile: ${await response.json()}`);
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchProfile):', error);
		throw error;
	}
}

export const updateProfileBio = async (username: string, bio: string) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/users/${username}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ bio })
		});

		if (!response.ok) throw new Error("Failed to update profile");
		return true;
	} catch (error) {
		console.error('API Error (updateProfileBio):', error);
		throw error;
	}
}