const bcrypt = require('bcrypt');
const { APIResponder } = require("..");

class AdminLogin extends APIResponder {
    constructor(props) {
        super(props);
        this.data = null;
        this.user = null;
    }

    async getUserData() {
        const collection = await this.getCollection('admins');
        const user = collection.findOne({ 'email': this.data.email});
        return user
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

module.exports = AdminLogin;