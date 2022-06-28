'use strict';

const combineImage = require('combine-image');
const pdfToPng = require('pdf-to-png-converter').pdfToPng;

const convert = async (file) => {
  let images = await pdfToPng(file, {disableFontFace: true, viewportScale: 3});
  let _imageBuffers = images.map((image) => image.content);
  let output = await combineImage(_imageBuffers, {direction: 'row'});
  console.log(file);
  await _writeJimpAsync(output, file.replace('.pdf', '.png'));
  console.log(file.replace('.pdf', '.png'));
};

const _writeJimpAsync = async (jimpObject, path) => {
  return new Promise((resolve, reject) => {
    jimpObject.write(path, (err, result) => {
      if (err) {
        reject(err);
      }

      return resolve(result);
    });
  });
};

const run = async () => {
  const DIR = '.'; // TODO: Replace this with dirname
  let dirs = fs.readdirSync(DIR);

  let files = [];

  dirs.forEach((dir) =>
    files.push(
      ...fs
        .readdirSync(DIR + dir)
        .filter((f) => f.includes('.pdf'))
        .map((file) => DIR + dir + '/' + file)
    )
  );

  let progress = 0;
  for (let i = 0; i < files.length; i++) {
    progress = ((i * 100) / files.length).toFixed(2);
    console.log(`${i + 1} of ${files.length} - (${progress}%)`);
    await convert(files[i]);
    console.log();
  }
};

module.exports = run;
