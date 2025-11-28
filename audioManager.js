const AudioManager = {
    sfxEnabled: true,
    audioCache: {},

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