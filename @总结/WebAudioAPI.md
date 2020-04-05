## Web Audio API

> 提供了在 Web 上控制音频的一个非常有效通用的系统，允许开发者来自选音频源，对音频添加特效，使音频可视化，添加空间效果 （如平移），等等。

---

## 1. 使用？

1. 创建音频上下文
2. 在音频上下文里创建源 — 例如 audio 标签, 振荡器, 流
3. 创建效果节点，例如混响、双二阶滤波器、平移、压缩
4. 为音频选择一个目的地，例如你的系统扬声器 (audioCtx.destination)
5. 连接源到效果器，对目的地进行效果输出

```js
// 1. 创建音频上下文
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 2. 在音频上下文里创建源 — 例如 audio 标签, 振荡器, 流
```

---

[AudioContext 属性,接口参考](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

## 2. AudioContext 属性

- currentTime 只读
  > 以双精度浮点型数字返回硬件调用的秒数，AudioContext 一创建就从 0 开始走，无法停掉、暂停或者重置。
- destination 只读
  > 返回 AudioDestinationNode 对象，表示当前 audio context 中所有节点的最终节点，一般表示音频渲染设备。
- listener 只读
  > 返回 AudioListener 对象，用于 3D 音频空间化。
- sampleRate 只读
  > 返回用浮点数表示的采样率，也就是每秒的采样数，同一个 AudioContext 中的所有节点采样率相同，所以不支持采样率转换。
- state 只读
  > 返回 AudioContext 当前状态.

---

## 3. AudioContext 方法

- close()
  > 关闭一个音频环境, 释放任何正在使用系统资源的音频
- createMediaElementSource(audioDom)
  > 用于创建一个新的 MediaElementAudioSourceNode 对象,输入某个存在的 HTML audio 或 video 元素, 对应的音频即可被播放或者修改
- decodeAudioData( ArrayBuffer, success, err )
  > 用于异步解码音频文件中的 ArrayBuffer，新的 Promise 可以将 回调参数放在 then 后面
  >
  > > ArrayBuffer 该参数可以通过 XMLHttpRequest 和 FileReader 来获取. AudioBuffer 是通过 AudioContext 采样率进行解码的,然后通过回调返回结果.
  >
  > > success 当成功解码后会被调用的回调函数. 该回调函数只有一个 AudioBuffer 类型参数.
  >
  > > err 一个可选的错误回调函数.
  ```js
  //旧版回调语法
  audioCtx.decodeAudioData(audioData, function (decodedData) {
    // use the dec​oded data here
  });
  //新版的Promise语法
  audioCtx.decodeAudioData(audioData).then((decodedData) => {
    // use the decoded data here
  });
  ```
- createBufferSource()

  > 创建一个 AudioBufferSourceNode 对象, 他可以通过 AudioBuffer 对象来播放和处理包含在内的音频数据.
  >
  > > AudioBuffer 可以通过 AudioContext.createBuffer 方法创建或者使用 AudioContext.decodeAudioData 方法解码音轨来创建。

- 小结：

  > FileReader 是 接收 File，返回 ArrayBuffer

  > decodeAudioData 是接收 ArrayBuffer，返回 AudioBuffer

  > createBufferSource 其实例 可以通过 AudioBuffer 来播放音频

---

## 4. AudioBufferSourceNode 使用

> 一个 AudioBufferSourceNode 只能被播放一次，也就是说，每次调用 start() 之后，如果还想再播放一遍同样的声音，那么就需要再创建一个 AudioBufferSourceNode

- buffer 读写
  > 用 audioBuffer 赋值给它， source 通过该属性确定 播放的文件
- connect(oAc.destination)
  > 方法 连接 目的地(即最终播放设备，例如扬声器，耳机)
- start(time,offset)
  > 有了 buffer 且 connect()之后，可以使用该方法 播放 文件
  >
  > > time 为延迟开始的时间
  >
  > > offset 为 开始播放的 偏移量( 暂停再播放用)
- onended 事件
  > 事件函数，播放完毕之后的事

```js
let source = audioCtx.createBufferSource(); //返回 AudioBufferSourceNode 对象

source.buffer = audioBuffer; //将 audioBuffer 存入 buffer属性里
console.log(oAc.destination);
source.connect(oAc.destination); // 连接目的地
source.start(); //开始播放
source.onended = function () {
  // source.start();  //一个 source 只能播放一次，所以这里无效
};
```
