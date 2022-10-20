const { FieldPath, FieldValue } = require("@google-cloud/firestore");
const { FormDataHandler } = require("../..");

class EditFootballMatch extends FormDataHandler {
    constructor(props) {
        super(props);
    }

    async run(response) {
        try {
            await this.retrieveData();

            const updateResult = await this.getCollection('football-matches')
                .where(FieldPath.documentId(), '==', this.fields.docId)
                .get()
                .then(querySnapshot => {
                    const ref = querySnapshot.docs[0].ref;
                    delete this.fields.docId;

                    if (this.fields.stage && this.fields.stage != 'Group') {
                        // it was group stage and now it is not
                        // delete match day. Other stages of a tournament do not have the field
                        return ref.update({ ...this.fields, matchDay: FieldValue.delete() })
                    } else {
                        return ref.update(this.fields);
                    }
                })

                if (updateResult.writeTime) {
                    console.log('Changes to match made successfully');
                    this.respond(response, 'success');
                }
        } catch (error) {
            console.log('An error occurred while editing match: ', error);
            this.respond(response, 'error');
        }
    }
}

module.exports = EditFootballMatch;