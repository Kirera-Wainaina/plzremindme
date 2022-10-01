const { CloudHandler } = require("./CloudHandler");
const path = require('path');
const fs = require('fs');

class CloudFileEditor extends CloudHandler {
    constructor(props, previousFileName) {
        super(props);
        this.previousFileName = previousFileName;
    }

    rewriteFile(cloudFile) {
        cloudFile ? this.cloudFile = cloudFile : this.cloudFile = this.bucket.file(path.basename(this.convertedFilePath));
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.convertedFilePath)
            .pipe(this.cloudFile.createWriteStream())
            .on('error', error => reject(error))
            .on('finish', () => console.log(`Finished rewriting file ${path.basename(this.convertedFilePath)}`))
            .on('finish', () => resolve());
        })
    }

    renameFile() {
        const newFileName = path.basename(this.convertedFilePath);
        if (this.previousFileName != newFileName) {
            this.cloudFile = this.bucket.file(this.previousFileName);
            return this.cloudFile.rename(newFileName)
                .then(data => data[0])
        }
        Promise.resolve();
    }

    run() {
        return this.minimizeImage()
            .then(() => this.renameFile())
            .then(cloudFile => this.rewriteFile(cloudFile))
            .then(() => this.deleteAfterUpload())
            .then(() => this.getCloudFileMetadata())
    }
}

module.exports = CloudFileEditor;