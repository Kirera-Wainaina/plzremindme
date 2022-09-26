const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

class ImageHandler {
    constructor(filePath) {
        this.filePath = filePath;
        this.convertedFilePath = null;
    }

    async minimizeImage() {
        const results =  await imagemin(
            [this.filePath],
            {
                destination: path.join(path.dirname(__dirname), 'converted'),
                plugins: [imageminWebp()]
            }
        )
        this.convertedFilePath = results[0].destinationPath;
        return results[0];
    }
}

module.exports = ImageHandler;