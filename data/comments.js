//Jiaqing Wang
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const uuid = require('uuid');


async function getByCommentId(id) {

    const commentsCollection = await comments();
    const theComments = await commentsCollection.findOne({ _id: id });

    if (!theComments) throw 'This comment has been removed by Admin';
    return theComments;
}


async function addComments(user_id, comment, report_count, helpful_count) {
    if (!user_id || !comment || !report_count || !helpful_count)
        throw 'Error, insert comment missing one or more fields'

    if (typeof(user_id) != String)
        throw 'Error, the datatype of [user_id] is supposed to be STRING'

    if (typeof(report_count) != Number)
        throw 'Error, the datatype of field [report_count] is supposed to be NUMBER'

    if (typeof(helpful_count) != Number)
        throw 'Error, the datatype of field [helpful_count] is supposed to be NUMBER'

    const commentsCollection = await comments

    const newComments = {
        user_id: user_id,
        comment: comment,
        report_count: report_count,
        helpful_count: helpful_count,
        _id: uuid.v4()
    }

    const newInsertedComments = await commentsCollection.insertOne(newComments);
    if (newInsertedComments.insertedCount === 0) throw 'No Comment(s) input';
    return await this.getByCommentsId(newInsertedComments.insertedId);
}

module.exports = {
    getByCommentId,
    addComments
}