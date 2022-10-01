const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fsPromises = require('fs/promises');

dotenv.config()

class CloudHandler {
    constructor(filePath) {
        this.filePath = filePath;
        this.convertedFilePath = null;
        this.storage = new Storage({
            keyFilename: process.env.SERVICE_ACCOUNT_PATH,
            projectId: process.env.GCLOUD_PROJECT_ID
        });
        this.bucket = this.storage.bucket(process.env.BUCKET_NAME);
        this.cloudFile = null;
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

    deleteAfterUpload() {
        return Promise.all([fsPromises.unlink(this.filePath), fsPromises.unlink(this.convertedFilePath)])
    }

    getCloudFileMetadata() {
        return this.cloudFile.getMetadata().then(data => data[0]);
    }

}

exports.CloudHandler = CloudHandler;