const AudioManager = {
    sfxEnabled: true,

    playSFX(sfxId, volume = 0.5) {
        if (!this.sfxEnabled) return;
        const sfx = document.getElementById(sfxId);
        if (sfx) {
            sfx.volume = volume;
            sfx.currentTime = 0;
            sfx.play().catch(e => console.log('SFX blocked:', e));
        }
    },

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }
};