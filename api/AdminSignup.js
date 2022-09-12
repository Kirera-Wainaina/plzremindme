const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const index = require('../index.js');

dotenv.config();

class AdminSignup extends index.APIResponder {
    constructor(props) {
        super(props);
        this.data = null;
    }

    async saveToDatabase() {
        const collection = await this.getCollection('admins');
        const hash = await bcrypt.hash(this.data.password, 12);
        const result = await collection.insertOne({
            firstName: this.data.firstName,
            email: this.data.email,
            password: hash
        })
        return result
    }

    async run() {
        this.data = await this.retrieveData();
        const adminIsMatch = await bcrypt.compare(this.data.adminPassword, process.env.ADMIN_PASSWORD);
        if (adminIsMatch) {
            this.saveToDatabase().then(result => {
                    if (result.acknowledged) this.respondSuccess()
            })
        } else {
            this.respondUnauthorized();
        }
    }
}

module.exports = AdminSignup;