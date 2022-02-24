const { resolve } = require("path");
const { readFileSync } = require("fs");
const { Blob } = require("buffer");

const pathToPhoto = resolve(process.cwd(), "src", "static", "13.jpg");

const file = readFileSync(pathToPhoto);

const blob = new Blob([file.buffer], {
  type: "image/jpeg",
});

console.log("------------BLOB", blob.type);

/* // Создадим простой текстовый файл:
var data = 'Здесь текст для файла или положите в переменную Blob';
var file = new File([data], 'primer.txt', {type: 'text/plain'});

// Создаем коллекцию файлов:
var dt = new DataTransfer();
dt.items.add(file);
var file_list = dt.files;

console.log('Коллекция файлов создана:');
console.dir(file_list);

// Вставим созданную коллекцию в реальное поле:
document.querySelector('input[type="file"]').files = file_list; */
