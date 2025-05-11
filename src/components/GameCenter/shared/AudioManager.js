class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.musicTrack = null;
    this.volume = 1.0;
  }

  async loadSound(id, src) {
    const audio = new Audio(src);
    this.sounds.set(id, audio);
    return audio;
  }

  playSound(id) {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = this.volume;
      sound.play();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
    if (this.musicTrack) {
      this.musicTrack.volume = this.volume;
    }
  }

  stopAll() {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    if (this.musicTrack) {
      this.musicTrack.pause();
      this.musicTrack.currentTime = 0;
    }
  }
}

export default new AudioManager();
