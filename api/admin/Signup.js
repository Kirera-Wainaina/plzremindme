const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { JSONHandler } = require('../../index');


dotenv.config();

class Signup extends JSONHandler {
    constructor(props) {
        super(props);
        this.data = null;
    }

    async saveToDatabase() {
        const collection = this.getCollection('admins');
        const hash = await bcrypt.hash(this.data.password, 12);
        const result = await collection.add({
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
                    if (result.id) this.respond('success')
            }).catch(error => {
                console.log(error);
                this.respond('error')
            })
        } else {
            this.respond('unauthorized');
        }
    }
}

module.exports = Signup;