const API = require('../../helpers/api');

module.exports = {
  eleventyComputed: {
    subject: async data => await API.get(data.subjectURL)
  }
}