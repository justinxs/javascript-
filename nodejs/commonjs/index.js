
// 在 Node.js 模块系统中，每个文件都被视为一个独立的模块
const circle = require('./circle.js');
console.log(`半径为 4 的圆的面积是 ${circle.area(4)}`);
const path = require('path')
console.log(__dirname, __filename, path.resolve(__dirname, '/'))


// 访问主模块（入口文件）
console.log(require.main === module, require.main.filename)


console.log(require.resolve('./circle.js'))


// require()规则

// require(X) from module at path Y                       （例如：X = './circle.js'; Y = __dirname)
// 1. If X is a core module,                              （如果 X 是一个node内置模块直接返回）
//    a. return the core module
//    b. STOP
// 2. If X begins with '/'                                （如果 X 以 / 开始，那么 Y 就是文件系统的根路径 如：C:/）
//    a. set Y to be the filesystem root
// 3. If X begins with './' or '/' or '../'               （如果 X 以相对路径开始，那么以 Y 作参照加载文件或者文件目录）
//    a. LOAD_AS_FILE(Y + X)
//    b. LOAD_AS_DIRECTORY(Y + X)
//    c. THROW "not found"
// 4. If X begins with '#'                                （如果 X 以 # 开始， imports子路径的导出）
//    a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
// 5. LOAD_PACKAGE_SELF(X, dirname(Y))                    （exports子路径的导出）
// 6. LOAD_NODE_MODULES(X, dirname(Y))                    （第三方包导出）
// 7. THROW "not found"

// LOAD_AS_FILE(X)                                                                （加载文件，查找步骤：X => X.js => X.json => X.node）
// 1. If X is a file, load X as its file extension format. STOP
// 2. If X.js is a file, load X.js as JavaScript text. STOP
// 3. If X.json is a file, parse X.json to a JavaScript Object. STOP
// 4. If X.node is a file, load X.node as binary addon. STOP

// LOAD_INDEX(X)                                                                    （默认加载文件目录中的index文件，查找步骤：X => X/index.js => X/index.json => X/index.node）
// 1. If X/index.js is a file, load X/index.js as JavaScript text. STOP
// 2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
// 3. If X/index.node is a file, load X/index.node as binary addon. STOP

// LOAD_AS_DIRECTORY(X)     （加载文件目录，如果 X/package.json存在并main字段存在，查找以 X 作参照的main路径，查找步骤：M => M/index => X/index；若package.json不存在，查找X/index）
// 1. If X/package.json is a file,
//    a. Parse X/package.json, and look for "main" field.
//    b. If "main" is a falsy value, GOTO 2.
//    c. let M = X + (json main field)
//    d. LOAD_AS_FILE(M)
//    e. LOAD_INDEX(M)
//    f. LOAD_INDEX(X) DEPRECATED
//    g. THROW "not found"
// 2. LOAD_INDEX(X)

// LOAD_NODE_MODULES(X, START)                    （加载node_modules包，查找包管理文件目录，遍历目录，包导出 =>  文件导出 => 文件目录导出）
// 1. let DIRS = NODE_MODULES_PATHS(START)
// 2. for each DIR in DIRS:
//    a. LOAD_PACKAGE_EXPORTS(X, DIR)
//    b. LOAD_AS_FILE(DIR/X)
//    c. LOAD_AS_DIRECTORY(DIR/X)

// NODE_MODULES_PATHS(START)   （查找包管理文件目录，从 START 处向上查找 node_modules，有就返回，一直查找到全局目录$USER/.node_modules => $USER/.node_libraries => $PREFIX/lib/node)
// 1. let PARTS = path split(START)
// 2. let I = count of PARTS - 1
// 3. let DIRS = [GLOBAL_FOLDERS]
// 4. while I >= 0,
//    a. if PARTS[I] = "node_modules" CONTINUE
//    b. DIR = path join(PARTS[0 .. I] + "node_modules")
//    c. DIRS = DIRS + DIR
//    d. let I = I - 1
// 5. return DIRS

// LOAD_PACKAGE_IMPORTS(X, DIR)
// 1. Find the closest package scope SCOPE to DIR.
// 2. If no scope was found, return.
// 3. If the SCOPE/package.json "imports" is null or undefined, return.
// 4. let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
//   ["node", "require"]) defined in the ESM resolver.
// 5. RESOLVE_ESM_MATCH(MATCH).

// LOAD_PACKAGE_EXPORTS(X, DIR)                                （
// 1. Try to interpret X as a combination of NAME and SUBPATH where the name
//    may have a @scope/ prefix and the subpath begins with a slash (`/`).
// 2. If X does not match this pattern or DIR/NAME/package.json is not a file,
//    return.
// 3. Parse DIR/NAME/package.json, and look for "exports" field.
// 4. If "exports" is null or undefined, return.
// 5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
//    `package.json` "exports", ["node", "require"]) defined in the ESM resolver.
// 6. RESOLVE_ESM_MATCH(MATCH)

// LOAD_PACKAGE_SELF(X, DIR)
// 1. Find the closest package scope SCOPE to DIR.
// 2. If no scope was found, return.
// 3. If the SCOPE/package.json "exports" is null or undefined, return.
// 4. If the SCOPE/package.json "name" is not the first segment of X, return.
// 5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
//    "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
//    defined in the ESM resolver.
// 6. RESOLVE_ESM_MATCH(MATCH)

// RESOLVE_ESM_MATCH(MATCH)
// 1. let { RESOLVED, EXACT } = MATCH
// 2. let RESOLVED_PATH = fileURLToPath(RESOLVED)
// 3. If EXACT is true,
//    a. If the file at RESOLVED_PATH exists, load RESOLVED_PATH as its extension
//       format. STOP
// 4. Otherwise, if EXACT is false,
//    a. LOAD_AS_FILE(RESOLVED_PATH)
//    b. LOAD_AS_DIRECTORY(RESOLVED_PATH)
// 5. THROW "not found"





