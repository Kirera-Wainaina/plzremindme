const { APIResponder } = require("..");

class AdminLogin extends APIResponder {
    constructor(props) {
        super(props);
        this.data = null;
    }

    async run() {
        this.data = await this.retrieveData();
        console.log(this.data);
    }
}

module.exports = AdminLogin;