class GameEngine {
  constructor() {
    this.gameLoop = null;
    this.lastTime = 0;
    this.callbacks = new Set();
  }

  start() {
    this.lastTime = performance.now();
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  update(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    for (const callback of this.callbacks) {
      callback(deltaTime);
    }

    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  addUpdateCallback(callback) {
    this.callbacks.add(callback);
  }

  removeUpdateCallback(callback) {
    this.callbacks.delete(callback);
  }
}

export default new GameEngine();
