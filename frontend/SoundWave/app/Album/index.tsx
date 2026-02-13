import React, { useState } from 'react';

interface Album{
    title: string;
    artist: string;
    date: string;
    rating: string;
    genre: string;
}

const AlbumView: React.FC = () => {

    const [album, setAlbum] = useState<Album>({
        title: '',
        artist: 'justin bieber',
        date: '',
        rating: '4/10',
        genre: ''
    })

    const [tracks, setTracks] = useState<string[]>([]);

    const [comments, setComments] = useState<string('');
    const [recommended, setRecommended] = useState<string>('');
}