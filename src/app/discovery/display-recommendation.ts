import type { Track } from '@spotify/web-api-ts-sdk';
import type { ReccoBeatsRecommendation } from '../recco-beats/recco-beats.service';

export type DisplayRecommendation = {
    recommendation: ReccoBeatsRecommendation;
    spotifyTrack: Track;
};