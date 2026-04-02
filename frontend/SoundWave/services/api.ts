import {getStorageItemAsync, setStorageItemAsync} from '@/context/storage';
import {LoginRecord, SignupRecord} from "@/services/records";
import {router} from "expo-router";
// todo: use Expo's env vars for this in production; smth like process.env.EXPO_PUBLIC_API_URL
const BASE_URL = 'http://localhost:5000';

export const getAuthToken = async () => {
	return await getStorageItemAsync('userToken');
}

const handleAuthResponse = async (response: Response) => {
	if (response.status === 401) {
		await setStorageItemAsync('userToken', '');
		await setStorageItemAsync('userData', '');
		router.replace('/Login');
		throw new Error("Session expired. Please log in again.");
	}
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "An error occurred");
	}
	return response;
};

export const signUp = async (signup: SignupRecord) => {
	try {
		const response = await fetch(`${BASE_URL}/api/auth/register`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
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
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(loginData)
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Login failed");
		}

		if (data.token) {
			await setStorageItemAsync('userToken', data.token);
			await setStorageItemAsync('userData', JSON.stringify(data.user));
		}

		return data.user;
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

export const fetchReviews = async (id: number, type: 'song' | 'album') => {
	try {
		const response = await fetch(`${BASE_URL}/api/reviews/${type}/${id}`);
		if (!response.ok) throw new Error("Failed to fetch reviews");
		const data = await response.json();
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error(`API Error (fetch ${type} reviews):`, error);
		return [];
	}
};

export const postReview = async (id: number, type: 'song' | 'album', reviewText: string, rating: number = 0) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/reviews/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				song_id: type === 'song' ? id : null,
				album_id: type === 'album' ? id : null,
				rating: rating,
				review_text: reviewText
			})
		});

		await handleAuthResponse(response);
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
			body: JSON.stringify({content: text})
		});

		await handleAuthResponse(response);
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
			body: JSON.stringify({song_id: songId, rank: rank})
		});

		await handleAuthResponse(response);
		return true;
	} catch (error) {
		console.error('API Error (favoriteSong):', error);
		throw error;
	}
};

export const favoriteAlbum = async (albumId: number, rank: number = 1) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/users/favorite/album`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({album_id: albumId, rank: rank})
		});

		await handleAuthResponse(response);
		return true;
	} catch (error) {
		console.error('API Error (favoriteAlbum):', error);
		throw error;
	}
};

export const favoriteArtist = async (artistId: number, rank: number = 1) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/users/favorite/artist`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({artist_id: artistId, rank: rank})
		});

		await handleAuthResponse(response);
		return true;
	} catch (error) {
		console.error('API Error (favoriteArtist):', error);
		throw error;
	}
};

export const unfavoriteSong = async (songId: number, rank: number = 1) => {
	const token = await getAuthToken();
	const response = await fetch(`${BASE_URL}/api/users/favorite/song`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
		body: JSON.stringify({song_id: songId, rank})
	});
	if (!response.ok) throw new Error("Failed to unfavorite song");
	return true;
};

export const unfavoriteAlbum = async (albumId: number, rank: number = 1) => {
	const token = await getAuthToken();
	const response = await fetch(`${BASE_URL}/api/users/favorite/album`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
		body: JSON.stringify({album_id: albumId, rank})
	});

	await handleAuthResponse(response);
	return true;
};

export const unfavoriteArtist = async (artistId: number, rank: number = 1) => {
	const token = await getAuthToken();
	const response = await fetch(`${BASE_URL}/api/users/favorite/artist`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
		body: JSON.stringify({artist_id: artistId, rank})
	});

	await handleAuthResponse(response);
	return true;
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

export const fetchPopular = async () => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/popular`);
		if (!response.ok) throw new Error(`Failed to fetch popular: ${await response.json()}`);
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchPopular):', error);
	}
}

export const fetchNewReleases = async () => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/new_releases`);
		if (!response.ok) throw new Error(`Failed to fetch new_releases`);
		return await response.json();
	} catch (error) {
		console.error('API Error (fetchNewReleases:', error);
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
			body: JSON.stringify({bio})
		});

		await handleAuthResponse(response);
		return true;
	} catch (error) {
		console.error('API Error (updateProfileBio):', error);
		throw error;
	}
}

export const followUser = async (followedId: number) => {
	const token = await getAuthToken();
	const response = await fetch(`${BASE_URL}/api/users/follow`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		body: JSON.stringify({ followed_id: followedId })
	});

	await handleAuthResponse(response);
	return true;
};

export const unfollowUser = async (followedId: number) => {
	const token = await getAuthToken();
	const response = await fetch(`${BASE_URL}/api/users/unfollow`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
		body: JSON.stringify({ followed_id: followedId })
	});

	await handleAuthResponse(response);
	return true;
};

export const fetchRecommendations = async (artistName: string, type: 'song' | 'album') => {
	try {
		const response = await fetch(`${BASE_URL}/api/music/search?query=${encodeURIComponent(artistName)}&type=${type}&limit=10`);
		if (!response.ok) throw new Error("Failed to fetch recommendations");
		const data = await response.json();

		return data.results || [];
	} catch (error) {
		console.error('API Error (fetchRecommendations):', error);
		return [];
	}
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
	try {
		const token = await getAuthToken();
		const response = await fetch(`${BASE_URL}/api/users/change_password`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify({
				old_password: oldPassword,
				new_password: newPassword,
			}),
		});

		const data = await response.json();

		await handleAuthResponse(response);
		return true;
	} catch (error) {
		console.error('API Error (changePassword):', error);
		throw error;
	}
};