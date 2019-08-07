const $fs = require("fs");
const $path = require("path");
const $prettier = require("prettier");
const $argvs = process.argv;
if ($argvs.length < 3) return;
const $filePath = $argvs[2];
if ($fs.existsSync($filePath) === false) return;
const $fileData = $fs.readFileSync($filePath, {
    encoding: "utf8"
});
const $fileBeautify = $prettier.format($fileData, {
    filepath: $filePath,
    printWidth: 120,
    tabWidth: 4,
    semi: true,
    trailingComma: "none",
    bracketSpacing: true,
    alwaysParens: "always"
});
$fs.writeFileSync($filePath, $fileBeautify);
