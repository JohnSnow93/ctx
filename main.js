const fs = require('fs');




function walk (path){
    fs.readdir(path, (err, values) => {
        if(!err){
            values.forEach((dirItem) => {
                const isDirectory = fs.statSync(`${path}/${dirItem}`).isDirectory();
                if(!isDirectory && dirItem.match(/\.md$/ig)){
                    console.log(`${path}/${dirItem}`);
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

function parseMDtoHTML(){

}

function generateIndex(){

}

walk('./src');
