function jsonp(options) {
    let script = document.createElement('script');
    // 创造一个独一无二的函数名
    let myFn = 'myJsonp' + Math.random().toString().replace('.', '');
    // 全局创建此函数，以便后面执行 script 中代码的时候能找到 myFn
    window[myFn] = options.success;
    // 拼接参数
    let params = '';
    for (let k in options.data) {
        params += '&' + k + '=' + options.data[k];
    }
    // 拼接请求地址
    script.src = options.url + '?callback=' + myFn + params;
    document.body.appendChild(script);
    script.onload = function () {
        document.body.removeChild(script);
    }
}