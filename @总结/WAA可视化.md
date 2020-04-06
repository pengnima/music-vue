## AnalyserNode

> 数据分析和可视化，如果你想从音频里提取时间、频率或者其它数据，你需要 AnalyserNode。
>
> > AnalyserNode 表示一个可以提供实时频率分析与时域分析的切点，这些分析数据可以用做数据分析和可视化。

---

- ### 创建

  - #### AudioContext 的 createAnalyser()
    方法能创建一个 AnalyserNode，可以用来获取音频时间和频率数据，以及实现数据可视化。

  ```js
  let audioCtx = new AudioContext();
  let analyser = audioCtx.createAnalyser(); //这里返回的是一个 AnalyserNode 对象。
  source.connect(analyser); // source 连接 分析器
  analyser.connect(audioCtx.destination); //之后 分析器 连接 最终目的地
  ```

  AnalyserNode 赋予了节点可以提供实时频率及时间域分析的信息。它使一个 AudioNode 通过音频流不做修改的从输入到输出, 但允许你获取生成的数据, 处理它并创建音频可视化。

- ### 获取曲目的数据

  - #### fftSize
    一个无符号长整形(unsigned long)的值，代表了用于计算频域信号时使用的 FFT (快速傅里叶变换) 的窗口大小。
    fftSize 属性的值必须是从 32 到 32768 范围内的 2 的非零幂; 其默认值为 2048。
  - #### frequencyBinCount 只读
    一个无符号长整形(unsigned long)的值, 值为 fftSize 的一半。这通常等于将要用于可视化的数据值的数量。
  - #### getByteFrequencyData(uftArray)
    将 analyser 的频域数据拷贝进 Uint8Array 数组，utf-8，即：数组中最高值为 256

  ```js
  // 1. 设置fftSize的值，frequencyBinCount会自动是其一半(该值为 曲目频率数组的长度)
  analyser.fftSize = 512;
  // 2. 新建一个 utf8的数组（大小为 fftSize 的一半）
  let utfArray = new Uint8Array(analyser.frequencyBinCount);

  // 3. 将当前 频域数据拷贝进 Uint8Array数组
  analyser.getByteFrequencyData(utfArray); // 需要循环，否则 uft数组不会变，可以利用 requestAnimationFrame
  console.log(utfArray);
  ```

- ### 获取数据后，利用 canvas 绘制

  ```js

  // 画canvas（循环下面drawCanvas，注意每次循环开始之前要先清除上一次所绘的东东）
  ctx.clearRect(0, 0, 画布宽, 画布高);
  drawCanvas() {
    this.analyser.getByteFrequencyData(this.utfArray);
      this.utfArray.forEach((value, index) => {
        ctx.fillRect(位置x,位置y,方条宽,方条高);
      });

  }
  ```

---
