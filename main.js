const fs = require('fs');
const { default: parseMD } = require('parse-md');
const MarkdownIt = require('markdown-it');
const del = require('del');
md = new MarkdownIt();

function walk (path){
    fs.readdir(path, (err, values) => {
        if(!err){
            values.forEach((dirItem) => {
                const isDirectory = fs.statSync(`${path}/${dirItem}`).isDirectory();
                if(!isDirectory && dirItem.match(/\.md$/ig)){
                    console.log(`${path}/${dirItem}`);
                    parseMDtoHTML(`${path}/${dirItem}`);
                } else {
                    walk(`${path}/${dirItem}`)
                }
            });
        } else console.log(err);

    });



    // dirList.forEach(function(item){
    //     // if(fs.statSync(path + '/' + item).isFile()){
    //     //     fileList.push(path + '/' + item);
    //     // }
    //     console.log(item)
    // });

    // dirList.forEach(function(item){
    //     if(fs.statSync(path + '/' + item).isDirectory()){
    //         walk(path + '/' + item);
    //     }
    // });
}

function parseMDtoHTML(path){
    try {
        const str = fs.readFileSync(path, 'utf8');
        const { metadata, content } = parseMD(str);
        if(metadata && content){
            const { title, date } = metadata;

            const mdHtml = md.render(content);
            const articleHtml = `<article>
                <h2 class="article-title">${title}</h2>
                <p class="article-date">${date.toLocaleDateString()}</p>
                ${mdHtml}
            </article>`;
            const fileTitle = title.replace('/\s/g', '-');
            fs.writeFileSync(`./public/articles/${fileTitle}.html`, articleHtml);
        } else {
            throw new Error('An Error Occur in (function parseMDtoHTML)');
        }
    } catch (e) {
        console.log(e)
    }

}

function generateIndex(content, path){

}


function start() {
    del(['./public/articles/**']);
    walk('./src');
}

start();
