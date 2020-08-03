const API = require('../../helpers/api');
const discussionComments = require('../../helpers/discussionComments');

module.exports = {
  eleventyComputed: {
    subject: async data => await API.get(data.subjectURL),
    comments: async data => {
      const { subjects } = await discussionComments;
      const [ discussion ] = subjects.filter(discussion => discussion.focus._id === data.subject.zooniverse_id);
      data.subject.discussion = discussion || { comments: [] };
      return discussion && discussion.comments;
    }
  }
}