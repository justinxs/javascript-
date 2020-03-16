/**
 *     ┌───────────────────────────┐
 *  ┌─>│           timers          │
 *  │  └─────────────┬─────────────┘
 *  │  ┌─────────────┴─────────────┐
 *  │  │     pending callbacks     │
 *  │  └─────────────┬─────────────┘
 *  │  ┌─────────────┴─────────────┐
 *  │  │       idle, prepare       │
 *  │  └─────────────┬─────────────┘      ┌───────────────┐
 *  │  ┌─────────────┴─────────────┐      │   incoming:   │
 *  │  │           poll            │<─────┤  connections, │
 *  │  └─────────────┬─────────────┘      │   data, etc.  │
 *  │  ┌─────────────┴─────────────┐      └───────────────┘
 *  │  │           check           │
 *  │  └─────────────┬─────────────┘
 *  │  ┌─────────────┴─────────────┐
 *  └──┤      close callbacks      │
 *     └───────────────────────────┘
 * 
 * 每个框被称为事件循环机制的一个阶段,每个阶段都有一个 FIFO 队列来执行回调。
 * 虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。
 * 当该队列已用尽或达到回调限制，事件循环将移动到下一阶段
 * 
 * 阶段描述：
 * 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。（即是计时器到时的回调执行）
 * 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
 * idle, prepare：仅系统内部使用。
 * 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
 * 检测：setImmediate() 回调函数在这里执行。（当前事件循环轮次所有的setImmediate回调执行）
 * 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。
 * 
 * 注：在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭
 */

 /**
  * 1、定时器
  * 计时器指定 可以执行所提供回调 的 阈值，而不是用户希望其执行的确切时间。
  * 在指定的一段时间间隔后， 计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们（其他正在执行的同步任务会阻塞它的及时执行）
  * 
  * 如下：本轮事件循环前三个阶段 （定时器、待定回调和idle, prepare）都没有要执行的回调，进入轮询阶段。
  * 耗费2ms的文件读取回调先
  */

    const fs = require('fs');
    function someAsyncOperation(callback) {
        // Assume this takes 2ms to complete
        let startTime = Date.now();
        fs.readFile('./data.json', function (error, data) {
            console.log(Date.now() - startTime, 'readfile time')
            callback()
        });
    }

    const timeoutScheduled = Date.now();

    setTimeout(() => {
        const delay = Date.now() - timeoutScheduled;

        console.log(`${delay}ms have passed since I was scheduled`);
    }, 130);


    // do someAsyncOperation which takes 2 ms to complete
    someAsyncOperation(() => {
        const startCallback = Date.now();
        // do something that will take 10ms...
        while (Date.now() - startCallback < 10) {
            // do nothing
            console.log('10ms 循环阻塞');
        }
    });


    /**
     * 2、挂起的回调函数
     * 此阶段对某些系统操作（如 TCP 错误类型）执行回调。
     * 例如，如果 TCP 套接字在尝试连接时接收到 ECONNREFUSED，则某些 *nix 的系统希望等待报告错误。这将被排队以在 挂起的回调 阶段执行
     */




    /**
     * 3、轮询
     * 轮询 阶段有两个重要的功能：
     *  1.计算应该阻塞和轮询 I/O 的时间。
     *  2.然后，处理 轮询 队列里的事件
     * 
     * 当事件循环进入 轮询 阶段且 没有被调度的计时器时 ，将发生以下两种情况之一：
     *  如果 轮询 队列 不是空的 ，事件循环将循环访问回调队列并同步执行它们，直到队列已用尽，或者达到了与系统相关的硬性限制。
     *  如果 轮询 队列 是空的 ，还有两件事发生：
     *  如果脚本被 setImmediate() 调度，则事件循环将结束 轮询 阶段，并继续 检查 阶段以执行那些被调度的脚本。
     *  如果脚本 未被 setImmediate()调度，则事件循环将等待回调被添加到队列中，然后立即执行。
     * 
     * 一旦 轮询 队列为空，事件循环将检查 _已达到时间阈值的计时器_。如果一个或多个计时器已准备就绪，则事件循环将绕回计时器阶段以执行这些计时器的回调
     */



    /**
     * 4、检查阶段
     * 此阶段允许人员在轮询阶段完成后立即执行回调。如果轮询阶段变为空闲状态，并且脚本使用 setImmediate() 后被排列在队列中，则事件循环可能继续到 检查 阶段而不是等待
     * setImmediate() 实际上是一个在事件循环的单独阶段运行的特殊计时器。它使用一个 libuv API 来安排回调在 轮询 阶段完成后执行。
     * 通常，在执行代码时，事件循环最终会命中轮询阶段，在那等待传入连接、请求等。
     * 但是，如果回调已使用 setImmediate()调度过，并且轮询阶段变为空闲状态，则它将结束此阶段，并继续到检查阶段而不是继续等待轮询事件
     * 
     */



    /**
     * 5、关闭的回调函数
     * 如果套接字或处理函数突然关闭（例如 socket.destroy()），则'close' 事件将在这个阶段发出。否则它将通过 process.nextTick() 发出
     */



    /**
     * setImmediate() 对比 setTimeout()
     *  
     * setImmediate() 和 setTimeout() 很类似，但是基于被调用的时机，他们也有不同表现。
     *     setImmediate() 设计为一旦在当前 轮询 阶段完成， 就执行脚本。
     *     setTimeout() 在最小阈值（ms 单位）过后运行脚本
     * 
     * 执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）
     * 
     * 但是，如果你把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用
     * 
     * 使用 setImmediate() 相对于setTimeout() 的主要优势是，如果setImmediate()是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关
     */
    
    // timeout_vs_immediate.js
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    
    setImmediate(() => {
        console.log('immediate');
    });

    fs.readFile('./data.json', () => {
        setTimeout(() => {
            console.log('timeout');
        }, 0);
        setImmediate(() => {
            console.log('immediate');
        });
    });


    /**
     * process.nextTick()
     * 
     * 任何时候在给定的阶段中调用 process.nextTick()，所有传递到 process.nextTick() 的回调将在事件循环继续之前解析。
     * 这可能会造成一些糟糕的情况，因为它允许您通过递归 process.nextTick()调用来“饿死”您的 I/O，阻止事件循环到达 轮询 阶段
     * 
     * 通过将回调置于 process.nextTick() 中，脚本仍具有运行完成的能力，允许在调用回调之前初始化所有的变量、函数等。
     * 它还具有不让事件循环继续的优点，适用于让事件循环继续之前，警告用户发生错误的情况。
     */


    /**
     * process.nextTick() 对比 setImmediate()
     * 
     * process.nextTick() 在同一个阶段立即执行。
        setImmediate() 在事件循环的接下来的迭代或 'tick' 上触发
     */
