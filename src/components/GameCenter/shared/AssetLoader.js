class AssetLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadImage(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  async loadAudio(src) {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.cache.set(src, audio);
        resolve(audio);
      };
      audio.onerror = reject;
      audio.src = src;
    });
  }
}

export default new AssetLoader();
