export interface ProfileArtist {
    id: string;
    name: string;
    imageUrl: string | null;
    genres: string[];
    popularity: number;
}

export interface TopGenre {
    genre: string;
    count: number;
}

export interface ProfileTrack {
    id: string;
    name: string;
    artistNames: string[];
    albumImageUrl: string | null;
    popularity: number;
}

export interface ProfileSummary {
    artistAvgPopularity: number;
    trackAvgPopularity: number;
}

export interface UserProfile {
    displayName: string;
    imageUrl: string | null;
    topArtists: ProfileArtist[];
    topTracks: ProfileTrack[];
    topGenres: TopGenre[];
    summary: ProfileSummary;
}
