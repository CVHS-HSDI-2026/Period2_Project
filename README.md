# SoundWave

SoundWave is a community-oriented website that focuses on providing a social media experience for rating and finding good music.

# Deployment

SoundWave requires a separate musicbrainz-docker instance ([See: musicbrainz-docker](https://github.com/metabrainz/musicbrainz-docker)) running.
You can point to this container through the .env file (See the .env example).

Once the musicbrainz-docker instance is set up, running the frontend and backend through docker compose should be trivial.