# [FileReader 文档地址](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

## FileReader (文件读取器)

> FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容

> File 对象可以是来自用户在一个 input 元素上选择文件后返回的 FileList 对象,也可以来自拖放操作生成的 DataTransfer 对象,还可以是来自在一个 HTMLCanvasElement 上执行 mozGetAsFile()方法后返回结果。

---

## 基本使用

```js
// 1. 创建文件阅读器实例
let fr = new FileReader();

// 3. 先开启阅读器监听,onload表示 读取文件完毕
fr.onload = function (ev) {
  console.log(ev.target.result);
};
// 2. 开始读取文件
fr.readAsArrayBuffer(file);
```

- file 可以是 input 元素上选择文件后返回的 FileList 对象，用 document.querySelector(".file").files 获取
- FileList 对象里面只有简单的一些文件信息，而 fr 却是可以将读取的文件信息返回~

---

## 方法

- fr.abort()
  > 中止读取操作。在返回时，readyState 属性为 DONE。
- fr.readAsArrayBuffer(file)
  > 开始读取。 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
- fr.readAsBinaryString(file)
  > 开始读取。一旦完成，result 属性中将包含所读取文件的原始二进制数据。
- fr.readAsDataURL(file)
  > 开始读取。一旦完成，result 属性中将包含一个 data: URL 格式的 Base64 字符串以表示所读取文件的内容。
- fr.readAsText(file)
  > 开始读取。一旦完成，result 属性中将包含一个字符串以表示所读取的文件内容。
