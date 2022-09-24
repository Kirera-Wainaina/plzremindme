const bcrypt = require('bcrypt');
const { JSONHandler } = require('../../index');

class Login extends JSONHandler {
    constructor(props) {
        super(props);
        this.data = null;
        this.user = null;
    }

    async getUserData() {
        const collection = this.getCollection('admins');
        const user = await collection.where('email', '==', this.data.email).get()
        return user.docs[0].data();
    }

    verifyUser() {
        if (!this.user) { // email is not registered
            this.respond('unauthorized');
            return ;
        }
        this.comparePassword()
    }

    async comparePassword() {
        const result = await bcrypt.compare(this.data.password, this.user.password);
        result ? this.respond('success') : this.respond('unauthorized');
    }

    async run() {
        this.data = await this.retrieveData();
        this.user = await this.getUserData();
        this.verifyUser()
    }
}

module.exports = Login;