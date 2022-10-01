const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { CloudHandler } = require('./CloudHandler');
dotenv.config();

class CloudUploader extends CloudHandler {
    constructor(props) {
        super(props);
    }


    uploadToBucket() {
        this.cloudFile = this.bucket.file(path.basename(this.convertedFilePath));
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.convertedFilePath)
                .pipe(this.cloudFile.createWriteStream())
                .on('error', error => reject(error))
                .on('finish', () => {
                    console.log(`uploaded ${this.convertedFilePath} to cloud`);
                    resolve();
                })
        })
    }

    run() {
        return this.minimizeImage()
            .then(() => this.uploadToBucket())
            .then(() => this.deleteAfterUpload())
            .then(() => this.getCloudFileMetadata())
    }
}

module.exports = CloudUploader;