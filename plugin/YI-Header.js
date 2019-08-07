/***
 * |
 * YI-Header
 * |
 * @FileName:YI-Header.js
 * @Description:chensuiyi development tool box
 * @Version:1.0.0
 * @Author:chensuiyi
 * @Email:bimostyle@qq.com
 * @CreateTime:2019-08-06 14:00:08
 * @LastModifyTime:2019-08-07 02:16:52
 * @Author:chensuiyi
 * @Other:none
 **/
const $fs = require("fs");
const $path = require("path");
const $ConfigHeader = require($path.join(__dirname, "YI-Header.config.js"));
if(process.argv.length < 3)return;
const $filePath = process.argv[2];
if ($fs.existsSync($filePath) === false) return;

// 获取日期时间
function DateTime() {
    let $t = new Date();
    let $y = $t.getFullYear();
    let $m = $t.getMonth() + 1;
    let $d = $t.getDate();
    let $h = $t.getHours();
    let $f = $t.getMinutes();
    let $s = $t.getSeconds();
    $m = $m < 10 ? "0" + $m : $m;
    $d = $d < 10 ? "0" + $d : $d;
    $h = $h < 10 ? "0" + $h : $h;
    $f = $f < 10 ? "0" + $f : $f;
    $s = $s < 10 ? "0" + $s : $s;
    return $y + "-" + $m + "-" + $d + " " + $h + ":" + $f + ":" + $s;
}

// 获取扩展注释风格
function CommentStyle($ext) {
    const $Style = {
        ".js": {
            start: "\\/\\*\\*\\*",
            end: "\\*\\*\\/"
        },
        ".txt": {
            start: "\\/\\*\\*\\*",
            end: "\\*\\*\\/"
        }
    };
    return $Style[$ext];
}

// 标签函数
const $LabelFunc = {
    "@FileName": () => "@FileName:" + $path.basename(__filename),
    "@CreateTime": $text => {
        if ($text === "@CreateTime:") return "@CreateTime:" + DateTime();
        return $text;
    },
    "@LastModifyTime": () => "@LastModifyTime:" + DateTime(),
    "@Email": $text => {
        if ($text === "@Email:") return "@Email:" + $ConfigHeader["@Email"];
        return $text;
    },
    "@Author": $text => {
        if ($text === "@Author:") return "@Author:" + $ConfigHeader["@Author"];
        return $text;
    },
    "@LastEditor": $text => {
        if ($text === "@LastEditor:") return "@LastEditor:" + $ConfigHeader["@LastEditor"];
        return $text;
    },
    "@Version": $text => {
        if ($text === "@Version:") return "@Version:" + $ConfigHeader["@Version"];
        return $text;
    }
};
// 文件数据
const $fileData = $fs.readFileSync($filePath, { encoding: "utf8" });

// 文件扩展名
const $ext = $path.extname($filePath);

// 文件注释风格
const $commentStyle = CommentStyle($ext);

// 风格是否存在
if (!$commentStyle) {
    $fs.writeFileSync($filePath, $fileDataNew);
    return;
}

// 头部模板正则
const $YIHeaderRegExp = new RegExp(`^${$commentStyle.start}[\\S\\s]*${$commentStyle.end}?`);

// 开始替换
const $fileDataNew = $fileData.replace($YIHeaderRegExp, (...$args) => {
    // 取得头数据
    let $YIHeaderData = $args[0];

    // 循环替换
    for (let $prop in $LabelFunc) {
        if (!$LabelFunc.hasOwnProperty($prop)) continue;
        // 获取当前的匹配
        const $exp = new RegExp(`(?<text>${$prop}:.*[(\\n)|(\\r\\n)]?)`);

        // 替换当前的匹配
        $YIHeaderData = $YIHeaderData.replace($exp, (...$args) => {
            const $text = $args.slice(-1)[0].text;
            const $exp2 = new RegExp(`(?<text2>${$prop}:.*)`);
            return $text.replace($exp2, (...$args) => {
                const $text2 = $args.slice(-1)[0].text2;
                return $LabelFunc[$prop]($text2);
            });
        });
    }
    return $YIHeaderData;
});

$fs.writeFileSync($filePath, $fileDataNew);
