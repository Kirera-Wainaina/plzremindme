const { GETHandler } = require('../..');

class GetFootballTeams extends GETHandler {
    constructor(props) {
        super(props);
        this.teams = [];
    }

    async run() {
        const snapshot = await this.getCollection('football-teams').get();
        snapshot.forEach(doc => {
            this.teams.push({...doc.data(), docId: doc.id})
        });
        this.respond('success', JSON.stringify(this.teams));
    }
}

module.exports = GetFootballTeams;