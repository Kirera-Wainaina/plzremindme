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

    async run() {
        this.data = await this.retrieveData();
        this.user = await this.getUserData();
        console.log(this.user)
    }
}

module.exports = AdminLogin;