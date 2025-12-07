const AudioManager = {
    sfxEnabled: true,
    audioCache: {},
    bgmEnabled: true,
    currentBGM: null,
    playlist: [],
    currentTrackIndex: 0,
    isPlaying: false,
    pauseBetweenTracks: true,

    init(playlist) {
        this.playlist = playlist;
        this.shufflePlaylist();
    },

    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
    },

    playBGM() {
        if (!this.bgmEnabled || this.playlist.length === 0) return;

        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM = null;
        }

        const trackPath = this.playlist[this.currentTrackIndex];
        this.currentBGM = new Audio(trackPath);
        this.currentBGM.volume = 0.3;

        this.currentBGM.addEventListener('ended', () => {
            this.onTrackEnd();
        });

        this.currentBGM.play().catch(e => console.log('BGM blocked:', e));
        this.isPlaying = true;
    },

    onTrackEnd() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;

        if (this.currentTrackIndex === 0) {
            this.shufflePlaylist();
        }

        if (this.pauseBetweenTracks) {
            const pauseDuration = Math.random() * 10000 + 5000;
            setTimeout(() => {
                this.playBGM();
            }, pauseDuration);
        } else {
            this.playBGM();
        }
    },

    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM = null;
            this.isPlaying = false;
        }
    },

    playSFX(sfxId, volume = 0.5) {
        if (!this.sfxEnabled) return;

        let sfx = document.getElementById(sfxId);

        if (!sfx) {
            sfx = new Audio(sfxId);
        }

        if (sfx) {
            sfx.volume = volume;
            sfx.currentTime = 0;
            sfx.play().catch(e => console.log('SFX blocked:', e));
        }
    }
};