# WebSite

> 官网架构

## ✨ 项目简介

本项目为 静态官网类 项目，使用 [webpack]((https://webpack.docschina.org/concepts/) 搭建, 采用多文件多入口的模式生成页面，使用到的技术栈为：

* [jQuery](https://jquery.com/)
* [Sass](https://github.com/webpack-contrib/sass-loader)
* [CSS Modules](https://github.com/css-modules/css-modules)
* [webpack](https://webpack.docschina.org/concepts/)
* [nodejs](https://nodejs.org/)

## 🔨 开发构建

安装项目的全部依赖

```bash
`npm install` or `yarn`
```

开发模式，运行项目

```bash
`npm start` or `yarn start`
```

生产模式，构建项目

```bash
`npm run build` or `yarn build`
```


## ⌨️ Git 脚本

说明：每个人新建自己的分支

`git clone -b dev http://gitlab.sftcwl.com/fe/ReactMobx.git`

`git checkout -b ${yourname}`

`git push --set-upstream origin ${yourname}`

默认将更新合并到 dev 分支，其他人从 dev 分支拉取更新。

使用：将下面的代码保存为 `git.sh` 文件，将变量 `ME` 的值改为自己的分支名，每次在自己的分支下提交 commit 后，`sh git.sh` 运行脚本，即可实现与 dev 分支的自动更新合并同步。（如有冲突，自行解决冲突后，再次运行脚本即可。）


### 备注：

1.如需同步 master 分支，将 `MAIN` 变量的值改为 `master` 并运行脚本即可。

2.如果不能运行.sh文件，请在当前目录运行 `chmod +x *`

3.从远程分支拉取到自己的分支`git pull origin dev:${yourname}`



```bash
#!/bin/sh

if [ $? -ne 0 ]; then
exit 1
fi

MAIN="dev"
# 将变量 ME 的值改为自己的分支名
ME="branch_name"

git push
git pull
git merge origin/${MAIN}
git push

git checkout ${MAIN}
git pull
git merge ${ME}
git push

git checkout ${ME}
```

## 📦 打包

`sh zip.sh` 运行 `zip.sh` 脚本，即可生成构建好的文件的压缩包。


## 🔖 目录结构

```
├── README.md
├── build  --项目编译后的目录
├── config --webpack等配置文件目录
├── package-lock.json
├── package.json
├── src
│   ├── css  --公共样式文件夹
│   ├── img  --图片资源文件夹
│   ├── js  --公共脚本文件
│   ├── pages --页面文件夹
│   │   ├── index  --模块文件夹
│   │   │   ├── index.html --首页html
│   │   │   ├── index.js --首页脚本文件
│   │   │   ├── index.scss --首页样式表
│   │   ├── module  --模块文件夹
│   │   │   ├── module.html --html
│   │   │   ├── module.js --脚本
│   │   │   ├── module.scss --样式表
├── yarn-error.log
└── yarn.lock
```

## 📝 命名规范

文件以 [Camel-Case](https://baike.baidu.com/item/%E9%AA%86%E9%A9%BC%E5%91%BD%E5%90%8D%E6%B3%95) 命名，文件夹中的组件与其 `.scss` 样式文件名称一致，同样以 Camel-Case 命名，放置在文件夹第一层。

页面自有的文件命名为 `index.js`、`index.scss、index.html`（复数，小写）,被`index`文件夹包裹称之为一个页面模块，放置在`pages`目录下，每个模块的js、css、html与文件夹同名即可。
 
页面用到的公共资源文件（`img`、`js`、`css`）、公共工具函数（`utils`）等，放置在 `src` 下建公共目录。

总之，遵循公共内容放置在公共位置，自有模块自组织的原则。

### 页面文件

**`src/pages`**

Good:

```
src
  pages
    pageA
      pageA.html
      pageA.scss
      pageA.js
    pageB
      pageB.html
      pageB.scss
      pageB.js
```

Bad:

```
src
  pages
    pageA
      pageAbc.html // 应与文件夹同名
      pageA.scss
      pageA.js
    pageB
      pageB.html
      pageX.scss // 应与文件夹同名
      pageB.js
```
