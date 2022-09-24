const Busboy = require("busboy");
const { FormDataHandler } = require("../../index");

class AddFootballTeam extends FormDataHandler {
    constructor(props) {
        super(props)
    }

    run() {
        console.log('called')
        const busboy = Busboy({ headers: this.headers});

        busboy.on('field', (name, value) => {
            console.log(name, value)
        })

        this.stream.pipe(busboy)
    }
}

module.exports = AddFootballTeam;