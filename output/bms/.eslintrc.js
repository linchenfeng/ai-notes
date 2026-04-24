/*
 * @Author       : may.ruan
 * @Date         : 2022-11-21 09:45:41
 * @LastEditors  : may.ruan
 * @LastEditTime : 2023-10-08 17:47:45
 * @Description  : eslint rules 配置
 */
/*!
 *  'off' 或 0 - 关闭规则
 * 'warn' 或 1 - 开启规则，使用警告级别的错误：warn
 *'error' 或 2 - 开启规则，使用错误级别的错误：error
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    uni: true
  },
  extends: [
    './.eslintrc-auto-import.json',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-alert': 2, //禁止使用alert confirm prompt
    'no-array-constructor': 0, //禁止使用数组构造器
    'no-bitwise': 2, //禁止使用按位运算符
    'no-caller': 2, //禁止使用arguments.caller或arguments.callee
    'no-catch-shadow': 2, //禁止catch子句参数与外部作用域变量同名
    'no-class-assign': 2, //禁止给类赋值
    'no-cond-assign': 2, //禁止在条件表达式中使用赋值语句
    'no-console': 2, //禁止使用console
    'no-const-assign': 2, //禁止修改const声明的变量
    'no-constant-condition': 2, //禁止在条件中使用常量表达式 if(true) if(1)
    'no-control-regex': 2, //禁止在正则表达式中使用控制字符
    'no-debugger': 1, //禁止使用debugger
    'no-delete-var': 2, //不能对var声明的变量使用delete操作符
    'no-div-regex': 2, //不能使用看起来像除法的正则表达式/=foo/
    'no-dupe-keys': 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-dupe-args': 2, //函数参数不能重复
    'no-duplicate-case': 2, //switch中的case标签不能重复
    'no-else-return': 2, //如果if语句里面有return,后面不能跟else语句
    'no-empty': 2, //块语句中的内容不能为空
    'no-empty-character-class': 2, //正则表达式中的[]内容不能为空
    'no-eq-null': 2, //禁止对null使用==或!=运算符
    'no-eval': 2, //禁止使用eval
    'no-ex-assign': 2, //禁止给catch语句中的异常参数赋值
    'no-extend-native': 2, //禁止扩展native对象
    'no-extra-bind': 2, //禁止不必要的函数绑定
    'no-extra-boolean-cast': 2, //禁止不必要的bool转换
    'no-extra-parens': 2, //禁止非必要的括号
    'no-extra-semi': 2, //禁止多余的冒号
    'no-fallthrough': 2, //禁止switch穿透
    'no-func-assign': 2, //禁止重复的函数声明
    'no-implicit-coercion': 2, //禁止隐式转换
    'no-implied-eval': 2, //禁止使用隐式eval
    'no-inline-comments': 0, //禁止行内备注
    'no-inner-declarations': [2, 'functions'], //禁止在块语句中使用声明（变量或函数）
    'no-invalid-regexp': 2, //禁止无效的正则表达式
    'no-invalid-this': 2, //禁止无效的this，只能用在构造器，类，对象字面量
    'no-irregular-whitespace': 2, //不能有不规则的空格
    'no-iterator': 2, //禁止使用__iterator__ 属性
    'no-label-var': 2, //label名不能与var声明的变量名相同
    'no-lone-blocks': 2, //禁止不必要的嵌套块
    'no-lonely-if': 2, //禁止else语句内只有if语句
    'no-loop-func': 1, //禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    'no-mixed-spaces-and-tabs': [2, false], //禁止混用tab和空格
    'no-multi-spaces': 2, //不能用多余的空格
    'no-multi-str': 2, //字符串不能用\换行
    'no-native-reassign': 2, //不能重写native对象
    'no-negated-in-lhs': 2, //in 操作符的左边不能有!
    'no-new': 2, //禁止在使用new构造一个实例后不赋值
    'no-new-func': 2, //禁止使用new Function
    'no-new-object': 2, //禁止使用new Object()
    'no-new-wrappers': 2, //禁止使用new创建包装实例，new String new Boolean new Number
    'no-param-reassign': 2, //禁止给参数重新赋值
    'no-proto': 2, //禁止使用__proto__属性
    'no-redeclare': 2, //禁止重复声明变量
    'no-regex-spaces': 2, //禁止在正则表达式字面量中使用多个空格 /foo bar/
    'no-self-compare': 2, //不能比较自身
    'no-sequences': 2, //禁止使用逗号运算符
    'no-shadow': 2, //外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    'no-shadow-restricted-names': 2, //严格模式中规定的限制标识符不能作为声明时的变量名使用
    'no-spaced-func': 2, //函数调用时 函数名与()之间不能有空格
    'no-sparse-arrays': 2, //禁止稀疏数组， [1,,2]
    'no-trailing-spaces': 2, //一行结束后面不要有空格
    'no-throw-literal': 2, //禁止抛出字面量错误 throw "error";
    'no-undef': 2, //不能有未定义的变量
    'no-undefined': 2, //不能使用undefined
    'no-unreachable': 2, //不能有无法执行的代码
    'no-unused-expressions': 2, //禁止无用的表达式
    'no-unused-vars': [2, { vars: 'all', args: 'after-used' }], //不能有声明后未被使用的变量或参数
    'no-use-before-define': 2, //未定义前不能使用
    'no-useless-call': 2, //禁止不必要的call和apply
    'no-void': 2, //禁用void操作符
    'no-var': 2, //禁用var，用let和const代替
    'no-warning-comments': [1, { terms: ['todo', 'fixme', 'xxx'], location: 'start' }], //不能有警告备注
    'no-with': 2, //禁用with
    'array-bracket-spacing': [2, 'never'], //是否允许非空数组里面有多余的空格
    camelcase: 2, //强制驼峰法命名
    'consistent-this': [2, 'that'], //this别名
    curly: [2, 'all'], //必须使用 if(){} 中的{}
    'default-case': 2, //switch语句最后必须有default
    eqeqeq: 2, //必须使用全等
    'init-declarations': 2, //声明时必须赋初值
    'max-params': [0, 3], //函数最多只能有3个参数
    strict: 2, //使用严格模式
    'use-isnan': 2, //禁止比较时使用NaN，只能用isNaN()
    'valid-typeof': 2, //必须使用合法的typeof的值
    'vars-on-top': 2, //var必须放在作用域顶部
    'wrap-iife': [2, 'inside'], //立即执行函数表达式的小括号风格
    'wrap-regex': 0, //正则表达式字面量用小括号包起来
    yoda: [2, 'never'], //禁止表达条件
    '@typescript-eslint/no-var-requires': 0,
    'vue/multi-word-component-names': 0
  }
}
