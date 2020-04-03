// 监听者模式

class Dispatcher {
  constructor() {
    this.handlers = [];
  }

  // 监听对象
  listen(h) {
    this.handlers.push(h);
  }

  // 让每个对象发送...args
  emit(...args) {
    this.handlers.forEach(handler => {
      handler(...args);
    });
  }
}

// 播放器
class Player {
  constructor() {
    this.audioContext = new AudioContext();
    this.playList = [];
    this.playIndex = 0;

    this.emptyNode = {
      file: null,
      offset: 0,
      start: null,
      source: null,
      buffer: null
    };

    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();
    this.onChange = new Dispatcher();
    this.onReady = new Dispatcher();
  }

  async readAudioBuffer(file) {}

  async append(file) {}
  play() {}
  pause() {}
  stop() {}
  next() {}
  prev() {}

  get isEmpty() {}
  get current() {}
  get position() {}
  set position(val) {}
  get duration() {}
}

export const player = new Player();
