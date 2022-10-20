const { FieldPath } = require("@google-cloud/firestore");
const { JSONHandler } = require("../..");

class DeleteFootballMatch extends JSONHandler {
    constructor(props) {
        super(props)
    }

    async run() {
        try {
            const data = await this.retrieveData();
            
            const results = await this.getCollection('football-matches')
                .where(FieldPath.documentId(), '==', data.docId)
                .get()
                .then(querySnapshot => {
                    const ref = querySnapshot.docs[0].ref;
                    return ref.delete()
                })
        
            results.writeTime ? this.respond('success') : this.respond('error');
        } catch (error) {
            console.log('There was an error while deleting a match', error);
            this.respond('error');
        }
    }
}

module.exports = DeleteFootballMatch;