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

class Player {
  constructor() {
    this.audioCtx = new AudioContext(); // 音频上下文
    this.analyser = this.audioCtx.createAnalyser(); //分析器
    this.analyser.fftSize = 128;
    this.utfArray = new Uint8Array(this.analyser.frequencyBinCount); //utf8数组(长度 64)
    this.tempArr = []; //临时数组，用来存放前一段 utf8的数组，暂停时可以利用改数组做 canvas递减
    this.rectMargin = 0; // 方条间隙
    this.rectWidth = 0; // 绘制的方条宽度
    this.heightRate = 0; // 方条高度的比率

    this.playList = []; // 曲目列表
    this.playIndex = 0; // 当前播放曲目下标

    // 空的曲目节点  对应  playList[playIndex]
    this.emptyNode = {
      file: null, //文件
      start: null, //记录曲目开始的时间
      offset: 0, //开始位置偏移量
      source: null, // AudioBufferSourceNode 实例(控制播放音乐的)
      buffer: null, // 文件的buffer
    };

    //暂停/播放
    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();

    //改变磁盘图片
    this.onReady = new Dispatcher();
    this.onChange = new Dispatcher();
  }
  /**
   * 功能方法 =============================================================================================
   */
  //修正canvas参数
  amendData(cWidth, cHeight) {
    this.rectMargin = Math.floor(cWidth / this.analyser.frequencyBinCount) + 2; //+ 2是由于utf8数组里后面很多都是0，那干脆挤掉算了
    this.rectWidth = this.rectMargin - 1;
    this.heightRate = Math.floor((cHeight / 256) * 100) / 100;
  }
  // 画canvas
  drawCanvas(cHeight, ctx, isPlaying) {
    this.analyser.getByteFrequencyData(this.utfArray);
    // 正在播放时，每次将uft存入 临时数组里
    if (isPlaying) {
      this.tempArr = this.utfArray;
      this.utfArray.forEach((value, index) => {
        ctx.fillRect(
          10 + index * this.rectMargin,
          cHeight - value * this.heightRate,
          this.rectWidth,
          value * this.heightRate
        );
      });
    } else {
      // 暂停时，利用 临时数组递减来做方条下坠
      this.tempArr.forEach((value, index) => {
        if (value-- > 0) {
          ctx.fillRect(
            10 + index * this.rectMargin,
            cHeight - value * this.heightRate,
            this.rectWidth,
            value * this.heightRate
          );
          this.tempArr[index] = value;
        }
      });
    }
  }

  // 读取文件的 audioBuffer
  async getBuffer(file) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();

      fr.onload = (ev) => {
        this.audioCtx.decodeAudioData(ev.target.result).then((data) => {
          resolve(data);
        });
      };
      fr.onerror = reject;
      fr.readAsArrayBuffer(file);
    });
  }

  // 将node存放至 playerList 里
  async append(file) {
    /* 
     由于追加曲目可以在 播放过程中追加，也可以在播放之前追加
     所以要先检测 当前是否为 空node，如果为空node，则表示还没有曲目，那么要换图片
     如果不为空，那么就不用换图片
    */
    const isEmpty = this.isEmpty;
    this.playList.push({
      file,
      offset: 0,
      start: null,
      source: null,
      buffer: await this.getBuffer(file),
    });

    if (isEmpty) {
      this.onReady.emit();
    }
  }

  //开始播放
  play() {
    // 播放需要 source，即 AudioBufferSourceNode
    if (!this.playList.length || this.current.source) {
      return;
    }
    // console.log("来了");
    let source = this.audioCtx.createBufferSource();
    source.buffer = this.current.buffer;
    /**
     * 事件 的绑定函数，在执行到 那一段语句时，会先调用一次 绑定函数
     * source.onended = this.next();  当执行该语句时，会把 next() 当成绑定函数执行了。。然后next()里面又有 this.play()，所以无限循环了
     * 然而：
     *    source.onended = ()=>{
     *       this.next();
     *    }
     * 把箭头函数作为绑定函数，执行箭头函数，然后将其内部的 this.next() 与事件绑定，当事件触发时，就触发 this.next()函数
     *
     * 也可以用 bind(this)来代替箭头函数~
     * bind()会创建一个新函数，被称为绑定函数
     * this.next.bind(this);
     * 没有bind(this) 会报错，会报说 current 超出堆栈
     */
    //当前曲目播放完，执行下一首曲子
    source.onended = () => {
      this.next();
    };
    //先连接上分析器
    source.connect(this.analyser);
    //分析器在连接目的地
    this.analyser.connect(this.audioCtx.destination);

    source.start(0, this.current.offset);
    this.current.source = source;
    this.current.start = this.audioCtx.currentTime; //记录曲目开始时间，暂停时再用 currentTime - offset

    this.onPlay.emit();
  }

  //暂停
  pause() {
    if (!this.playList.length || !this.current.source) {
      return;
    }
    //source停止
    this.current.source.stop(0);
    this.current.source.disconnect();
    this.current.source.onended = null;
    //修改current其他内容
    this.current.source = null;
    this.current.offset = this.position;
    this.current.start = null;

    this.onPause.emit();
  }
  //停止
  stop() {
    this.pause();
    this.current.offset = 0;
  }
  //上一首
  prev() {
    // 通过改变 playIndex 实现
    this.stop();
    --this.playIndex;
    if (this.playIndex < 0) {
      this.playIndex = this.playList.length - 1;
    }

    this.play();
    if (this.playList.length > 1) {
      this.onChange.emit();
    }
  }
  //下一首
  next() {
    this.stop();
    ++this.playIndex;
    if (this.playIndex >= this.playList.length) {
      this.playIndex = 0;
    }

    this.play();
    if (this.playList.length > 1) {
      this.onChange.emit();
    }
  }

  /**
   * 只读属性============================================================================
   */
  // 当前曲目是否为空节点
  get isEmpty() {
    return this.current === this.emptyNode;
  }
  // 当前node
  get current() {
    return this.playList[this.playIndex] || this.emptyNode;
  }
  // 曲目时长
  get duration() {
    return this.current.buffer ? this.current.buffer.duration : 0.001;
  }
  // 曲目进度条位置
  get position() {
    if (!this.playList.length) {
      return 0;
    }
    return (
      this.current.offset +
      (this.current.start != null
        ? this.audioCtx.currentTime - this.current.start
        : 0)
    );
  }

  // 曲目位置可以设置
  set position(rate) {
    if (!this.playList.length) {
      return;
    }
    let val = rate * this.duration;
    this.pause();
    this.current.offset = val;
    this.play();
  }
}

export const player = new Player();
