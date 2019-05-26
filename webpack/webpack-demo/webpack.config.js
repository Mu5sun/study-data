const path = require('path')
// npm install html-webpack-plugin -D
// 功能-- 会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到html文件中
const HtmlWebpackPlugin = require('html-webpack-plugin')
// npm install clean-webpack-plugin -D
// 功能-- 会在打包之前，删除掉上一次打包后生成的文件。让每一次打包都是生成新文件
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development', // 配置环境， development 开发环境， production 生产环境
  // development 环境 -- 使用 cheap-module-eval-source-map 这个错误提示是比较全的
  // production 环境 -- 使用 cheap-module-source-map
  devtool: 'source-map', // 配置打包后，代码报错，提示错误的信息会直接指向源代码中的错误点
  entry: {
    // 配置入口文件的路径
    main: './src/index.js'
    // sub: './src/index.js' // 配置多页面时， 有多个入口，就可以设置多个入口文件
  },
  devServer: {
    // 该配置需要在package.json中的scripts中配置一个命令，调用 webpack-dev-server ,需要安装
    // npm install webpack-dev-server -D
    contentBase: './dist', // 表明服务器要起在哪个文件夹下
    open: true, //  true - 开启 false - 不开启 该配置可以在启动webpack-dev-server时，会自动的在浏览器中打开开启本地服务器后的地址
    port: 8080, // 配置开启的服务器的端口号， 默认是8080
    proxy: {} // 配置服务器代理时使用
  },
  module: {
    // 配置模块打包时依赖的loader
    rules: [
      // 定义loader
      {
        test: /\.(jpg|png|gif)$/, // 打包图片模块时匹配文件后缀，可以根据项目来增加图片文件的后缀名
        use: {
          // npm install url-loader file-loader -D
          loader: 'url-loader', // 需要使用的loader，需要npm安装，功能和file-loader一样，默认是把图片打包成base64
          // loader: 'file-loader', // 需要使用的loader，需要npm安装
          options: {
            // 配置loader里的详细信息
            // 学名 - placeholder 占位符
            name: '[name].[ext]', // 配置图片打包后的名称，默认是使用hash值，可以配置成使用本来的文件名
            outputPath: 'images/', // 配置图片打包后存放的文件夹，默认是直接放在dist文件夹中
            limit: 2048 // 当图片的大小不超过2048个字节时，将图片打包成base64的文件，如果图片超过该大小，就打包成图片，放到images文件夹下
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/, // 打包css字体文件模块时匹配字体文件后缀
        use: {
          // npm install file-loader -D
          loader: 'file-loader' // 需要使用的loader，需要npm安装
        }
      },
      {
        // test: /\.css$/, // 打包css样式模块时匹配文件后缀
        test: /\.scss$/, // 打包css预编译语言模块时匹配文件后缀，根据需求，填写对应的文件后缀，一般是 scss sass stylus less
        // 打包css样式需要用到的loader，loader的读取顺序是从右往左，从下往上的
        // npm install style-loader css-loader scss-loader postcss-loader -D
        use: [
          'style-loader', // 将css文件挂载到页面的style标签中
          {
            loader: 'css-loader', // 将多个css文件编译成一个css文件
            options: {
              importLoaders: 2, // 该配置可以让引入scss样式文件里面通过@import来引入其他的scss文件同样会从该样式loader下面的2个样式loader开始解析
              modules: true // 开启css-loader的模块化打包，让css文件只在当前模块中有效。
              // 引用的时候需要注意   import style from './index.css'   使用的时候   style.classname   其中classname是定义的类名
            }
          },
          'scss-loader', // 用来将css预编译语言编译成css文件
          'postcss-loader' // 可以在css3新属性前面自动加上浏览器产商前缀，使用到autoprefixer这个插件，见 postcss.config.js
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html' // 打包结束后，会以该html文件为模版生成一个新的html文件
    }),
    new CleanWebpackPlugin(['dist']) // 指定删除掉的文件夹的名称
  ],
  output: {
    // 配置html文件引入js文件时的总的路径
    // publicPath: 'http://cdn.com.cn', // 针对把静态资源放在cdn或者其他云仓库上时使用
    // 配置出口文件
    filename: '[name].js', // 出口文件的名称
    // 当有多个入口文件时，相对应的就要有多个出口文件，这里如果继续使用一个固定的文件名就会报错，所以需要使用占位符
    // name 占位符 会被 entry对象中的key值代替
    path: path.resolve(__dirname, 'dist') // 存放出口文件夹的名称
  }
}
