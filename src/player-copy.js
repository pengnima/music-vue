// Dispatcher 里的 handlers存放着 函数
/**
 * handler 实际为一个 箭头函数
   () => {
      this.togglePlay(true);
    }
 */
class Dispatcher {
  constructor() {
    this.handlers = [];
  }
  push(h) {
    this.handlers.push(h);
  }
  emit() {
    this.handlers.forEach((h) => {
      h();
    });
  }
}

// 播放器
/**
 * 内含
 *  音频上下文 audioContext
 *  播放列表 playList
 *  曲目下标 playIndex
 *
 *  空的节点 emptyNode
 */
class Player {
  constructor() {
    this.audioContext = new AudioContext();
    this.playList = [];
    this.playIndex = 0;

    this.emptyNode = {
      file: null, // 读取的文件
      offset: 0, //开始播放的 偏移量( 暂停再播放用)
      start: null, //到开始播放时，用 aduioCtx.currentTime 赋值
      source: null,
      buffer: null,
    };

    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();
    this.onChange = new Dispatcher();
    this.onReady = new Dispatcher();
  }

  async readAudioBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        this.audioContext.decodeAudioData(evt.target.result).then((resData) => {
          console.log(resData);
          resolve(resData);
        });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async append(file) {
    // const isEmpty = this.isEmpty;
    this.playList.push({
      file,
      offset: 0,
      start: null,
      source: null,
      buffer: await this.readAudioBuffer(file),
    });
    // if (isEmpty) {
    //   this.onReady.emit();
    // }
  }
  play() {
    if (!this.playList.length || this.current.source) {
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = this.current.buffer;
    source.onended = this.next.bind(this);
    source.connect(this.audioContext.destination);
    source.start(0, this.current.offset);
    this.current.source = source;
    this.current.start = this.audioContext.currentTime;

    this.onPlay.emit();
  }
  pause() {
    if (!this.playList.length || !this.current.source) {
      return;
    }
    this.current.source.stop(0);
    this.current.source.disconnect(0);
    this.current.source.onended = null;
    this.current.source = null;
    this.current.offset = this.position;
    this.current.start = null;

    this.onPause.emit();
  }
  stop() {
    this.pause();
    this.current.offset = 0;
    this.current.start = null;
  }
  next() {
    this.stop();
    this.playIndex++;
    if (this.playIndex >= this.playList.length) {
      this.playIndex = 0;
    }
    this.play();
    // this.onChange.emit();
  }
  prev() {
    this.stop();
    this.playIndex--;
    if (this.playIndex < 0) {
      this.playIndex = Math.max(this.playList.length - 1, 0);
    }
    this.play();
    // this.onChange.emit();
  }

  get isEmpty() {
    return this.current === this.emptyNode;
  }
  get current() {
    return this.playList[this.playIndex] || this.emptyNode;
  }
  get position() {
    if (!this.playList.length) {
      return 0;
    }
    return (
      this.current.offset +
      (this.current.start !== null
        ? this.audioContext.currentTime - this.current.start
        : 0)
    );
  }
  set position(val) {
    // if (!this.playList.length) {
    //   return;
    // }
    // this.stop();
    // this.current.offset = val;
    // this.current.start = null;
    // this.play();
  }
  //总时长
  get duration() {
    return this.current.buffer ? this.current.buffer.duration : 0.001;
  }
}

export const player = new Player();
