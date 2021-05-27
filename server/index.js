process.on('uncaughtException', (err, origin) => {
    console.error('uncaughtException', err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的拒绝：', promise, '原因：', reason);
    // 记录日志、抛出错误、或其他逻辑。
});

require('./app')


// // unhandledRejection
// Promise.resolve().then(() => {
//     return JSON.parse()
// })

// // uncaughtException
// setTimeout(() => {
//     console.log('这里仍然会运行');
// }, 500);
// // 故意引起异常，但不要捕获它。
// nonexistentFunc();
// console.log('这里不会运行');