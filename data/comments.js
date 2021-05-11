//Jiaqing Wang
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const uuid = require('uuid');
const verifier = require("./verify");
const shareUtilsDB = require("./shareUtilsDB");


async function getByCommentId(id) {

    const commentsCollection = await comments();
    const theComments = await commentsCollection.findOne({ _id: id });

    if (!theComments) throw 'This comment has been removed';
    return theComments;
}


async function addComments(user_id, comment, report_count, helpful_count) {
    //用户是不是不应该有权限input report_count 和 helpful_count，是不是应该只保留前两个参数,
    //如果存储的是userid的话，如何实现读取当前登录用户的id
    if (!verifier.validString(comment)) throw 'Invalid Comment'
    if (!verifier.validNum(report_count)) throw 'Invalid Report Count'
    if (!verifier.validNum(helpful_count)) throw 'Invalid Helpful Count'

    const commentsCollection = await comments()

    const newComments = {
        user_id: user_id,
        comment: comment,
        report_count: report_count, //这里是不是要存id?
        helpful_count: helpful_count,
        _id: uuid.v4()
    }

    const newInsertedComments = await commentsCollection.insertOne(newComments);
    if (newInsertedComments.insertedCount === 0) throw 'No Comment(s) input';

    await shareUtilsDB.toggleCommentToUser(user_id, newComments._id);
    return await this.getByCommentId(newInsertedComments.insertedId);
}


async function getAllComments() {
    const CommentCollection = await comments();
    const CommentList = await CommentCollection.find({}).toArray();
    if (!CommentList) throw 'No Comment found in database';
    return CommentList;
}


async function deleteComment(id) {
    if (!verifier.validString(id)) throw 'id is undefined';

    const CommentCollection = await comments();
    const deletionInfo = await CommentCollection.deleteOne({ _id: id });
    if (deletionInfo.deletedCount == 0) throw `Comment, ${id}, can not be deleted.`

    //移除用户下评论？
    await shareUtilsDB.untoggleCommentToUser(userId, newComments._id);
    return true;
}


async function updateComment(commentId, updatedInfo) {
    if (!verifier.validString(commentId)) throw "User id is not a valid string.";

    //Unfinished, should helpful_count and helpful_count store a count of likes or userid?
    const commentCollection = await comment();
    let updatingInfo = {
        comment: updatedInfo.comment,
        report_count: updatedInfo.report_count, //id?
        helpful_count: updatedInfo.helpful_count //id?
    }
    const updatedComment = await commentCollection.updateOne({ _id: id }, { $set: updatingInfo })
    if (!updatedComment.matchedCount && !updatedComment.motifiedCount) throw 'updated failed.'

    return await this.getCommentById;
}


module.exports = {
    getByCommentId,
    addComments,
    getAllComments,
    deleteComment,
    updateComment
}