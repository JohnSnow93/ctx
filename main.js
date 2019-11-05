const fs = require('fs');
const { default: parseMD } = require('parse-md');
const MarkdownIt = require('markdown-it');
const walkdir = require('walkdir');
const del = require('del');

const md = new MarkdownIt();

async function walk (srcPath){
    let result = await walkdir.async(srcPath,{return_object:true});
    const mdPaths = [];
    Object.entries(result).forEach(([path, fileStatus]) => {
        if(!fileStatus.isDirectory() && path.match(/\.md$/ig)){
            mdPaths.push(path);
        }
    });
    return mdPaths;
}

function parseMDtoHTML(paths = []){
    let indexData = [];
    for (let i = 0; i < paths.length; i++) {
        const str = fs.readFileSync(paths[i], 'utf8');
        const { metadata, content } = parseMD(str);
        const { title, date } = metadata;
        // indexData之后用于生成首页
        const mdHtml = md.render(content);
        const articleHtml = `<article>
                <h2 class="article-title">${title}</h2>
                <p class="article-date">${date.toLocaleDateString()}</p>
                ${mdHtml}
            </article>`;
        const fileTitle = title.replace('/\s/g', '-');
        const writePath = `./public/articles/${fileTitle}.html`;
        fs.writeFileSync(writePath, htmlTemplate(articleHtml, '文章页', true));
        indexData.push({ ...metadata, fileTitle });
    }
    return indexData;

}

function generateIndex(indexData = []){
    const listHTML = indexData.map(i => {
        return `
<li>
    <a href="./articles/${i.fileTitle}.html">${i.title}</a>
    <time>${i.date.toLocaleDateString()}</time>
</li>
`
    }).join('');

    const indexHTML = htmlTemplate(listHTML);
    fs.writeFile('./public/index.html', indexHTML, function () {
        console.log(`写入index.html 成功`);
    });
}

function htmlTemplate(content, title = '站点标题', isArticle = false){
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>站点标题</title>
    <link rel="stylesheet" href="${isArticle ? '../styles.css' : './styles.css'}"> 
</head>
<body>
<header>${title}</header>
<ul>
    ${content}
</ul>
<footer> Simple Blog 2019-2020 </footer>
</body>
</html>
`;}

async function start() {
    // 1. 删除上一次生成的静态文件
    del(['./public/articles/**.html', './public/index.html']);
    // 2. 收集src目录下的所有markdown文件的路径
    const paths = await walk('./src');
    // 3. 读取所有markdown文件并生成html
    const indexData = await parseMDtoHTML(paths);
    // 4. 生成首页index.html
    await generateIndex(indexData);
}

start();
