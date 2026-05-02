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

export interface UserProfile {
    displayName: string;
    imageUrl: string | null;
    topArtists: ProfileArtist[];
    topGenres: TopGenre[];
    personalityLabel: string;
    personalityDescription: string;
}
