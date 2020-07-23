const API = require('../../helpers/api');

module.exports = {
  eleventyComputed: {
    subject: async data => await API.get(data.subjectURL),
    ogImage: data => data.subject.location,
    title: data => `Subject ${data.subject.zooniverse_id}: Collections`,
    description: data => `Collections that include subject ${ data.subject.zooniverse_id } from ${ data.project.display_name }.`
  }
}
