const { GETHandler } = require("../..");

class GetFootballCompetitions extends GETHandler {
    constructor(props) {
        super(props);

        this.data = [];
    }

    async run() {
        const snapshot = await this.getCollection('football-competitions').get();
        snapshot.forEach(doc => {
            this.data.push({...doc.data(), docId: doc.id})
        });
        this.respond('success', JSON.stringify(this.data));
    }

}

module.exports = GetFootballCompetitions;