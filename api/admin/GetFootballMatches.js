const { GETHandler } = require("../..");

class GetFootballMatches extends GETHandler {
    constructor(props) {
        super(props);
        this.matches = [];
    }

    async run() {
        const snapshot = await this.getCollection('football-matches')
            .orderBy('matchDay', 'asc')
            .get();
        snapshot.forEach(doc => {
            this.matches.push({ ...doc.data(), docId: doc.id });
        })
        this.respond('success', JSON.stringify(this.matches))
    }
}

module.exports = GetFootballMatches;