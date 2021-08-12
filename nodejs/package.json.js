// 包模块
// 版本	                 变更
// v14.13.0	            Add support for "exports" patterns.  （支持正则 exports）
// v14.6.0	            Add package "imports" field.  （添加imports字段）
// v13.7.0, v12.16.0	Unflag conditional exports.    （取消标记条件导出）
// v13.6.0, v12.16.0	Unflag self-referencing a package using its name.  （使用包名取消标记自调用包）
// v12.7.0	            Introduce "exports" package.json field as a more powerful alternative to the classic "main" field.（添加exports字段，扩展main导出入口）
// v12.0.0	            Add support for ES modules using .js file extension via package.json "type" field.（package.json type=module或者命令行--input-type=module字段支持es 模块）

// npm 包管理配置文件 package.json
// node_modules 安装包文件夹


// import 声明 只允许用于 es modules模块环境                                       import m from './esmodule.mjs'
// 在es modules环境中引入 commonjs包，module.exports 作为 default导出              import c from './commonjs.cjs'
// require方法 总是将文件当作 commonjs文件 处理，而且不能引入 es modules文件         const c = require('./commonjs.cjs')
// 动态引入 import() 支持在 commonjs模块环境 中引入 es modules包                    const m = import('./esmodule.mjs')


// 判断模块系统  commonjs 和 es modules

// 以下行为会将文件当作 es modules 处理执行 （require 不能引入 es modules，用 import() 代替）
// 1、.mjs 后缀的文件  import e from './es.mjs'.
// 2、.js 后缀的文件并且package.json中声明 type 字段等于 module  import e from './test.js'.
// 3、命令行声明 type 字段 --input-type=module


// nodejs 默认是以 commonjs 模块处理，主动声明使用 commonjs模块系统 如下
// 1、import c from './commonjs.cjs'
// 2、import c from './commonjs.js'，package.json中声明 type 字段等于 commonjs
// 3、命令行声明 type 字段 --input-type=commonjs


// .js .cjs .mjs /  不同的文件后缀以及 package.json文件决定nodejs 以何种方式处理它

// .mjs文件会一直作为 es modules 文件处理，忽略 package.json 中type字段的声明，即使 type = commonjs
// .cjs文件会一直作为 commonjs 文件处理，忽略 package.json 中type字段的声明，即使 type = module
// .js文件处理方式：
// 1、所处目录没有 package.json配置，继承上一级的模块系统，默认 commonjs
// 2、有package.json，根据配置的 type 字段决定其模块系统
// type = module，.cjs 作为commonjs处理，其他都是 es modules
// type = commonjs，.mjs 作为 es modules处理，其他都是 commonjs


// 包的入口
// package.json 有两个字段决定外部引入的入口 main 和 exports
// main 和 exports 同时存在，exports 优先 main 入口，但在低版本nodejs中，只支持 main 入口

// {
//     "name": "my-mod",
//     "main": "./lib/index.js",
//     "exports": {
//       ".": "./lib/index.js",
//       "./lib": "./lib/index.js",
//       "./lib/*": "./lib/*.js",
//       "./feature": "./feature/index.js",
//       "./feature/*": "./feature/*.js",
//       "./package.json": "./package.json",
//       "./features/private-internal/*": null,
//       "./feature": {
//             "import": "./main-module.mjs",
//             "require": "./main-require.cjs",
//             "node": "./feature-node.js",
//             "default": "./feature.js"
//       }
//     }
// }


// 子路径的导入

// import #dep 导入外部依赖包dep-node-native，其他环境默认导入./dep-polyfill.js
// {
//     "imports": {
//       "#dep": {

//         "node": "dep-node-native",
//         "default": "./dep-polyfill.js"
//       }
//     },
//     "dependencies": {
//       "dep-node-native": "^1.0.0"
//     }
// }









// module 模式没有 require 方法，需要完整的路径，js 被当作是 module 包处理
// require 模式不能使用 import，require 不能导入 mjs 包



import pkg from 'es'
import pkeg from 'es/module'
import cm from 'commonjs'
import et from 'entry'
et()


// const pkeg = require('es/module')
// const cm = require('commonjs')
// const et = import('entry')
// et.then(m => m.default())
