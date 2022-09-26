const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const fs = require('fs');
const fsPromises = require('fs/promises');
dotenv.config();

class ImageHandler {
    constructor(filePath) {
        this.filePath = filePath;
        this.convertedFilePath = null;
        this.storage = new Storage({
            keyFilename: process.env.SERVICE_ACCOUNT_PATH,
            projectId: process.env.GCLOUD_PROJECT_ID
        });
        this.bucket = this.storage.bucket(process.env.BUCKET_NAME);
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

    uploadToBucket() {
        return new Promise((resolve, reject) => {
            const file = this.bucket.file(path.basename(this.convertedFilePath));
            fs.createReadStream(this.convertedFilePath)
                .pipe(file.createWriteStream())
                .on('error', error => reject(error))
                .on('finish', () => {
                    console.log(`uploaded ${this.convertedFilePath} to cloud`);
                    resolve();
                })
        })
    }

    deleteAfterUpload() {
        return Promise.all([fsPromises.unlink(this.filePath), fsPromises.unlink(this.convertedFilePath)])
    }
}

module.exports = ImageHandler;