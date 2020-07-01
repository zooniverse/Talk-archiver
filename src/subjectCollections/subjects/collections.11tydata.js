module.exports = {
  eleventyComputed: {
    title: data => `Subject ${data.subject.zooniverse_id}: Collections`,
    description: data => `Collections that include subject ${ data.subject.zooniverse_id } from ${ data.project.display_name }.`,
    ogImage: data => data.subject.location.standard
  }
}
