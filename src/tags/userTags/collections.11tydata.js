function ogImage({ tag }) {
  const subject = tag.subjects[0];
  return subject ? subject.location : undefined;
}

module.exports = {
  eleventyComputed: {
    title: data => `Tag: ${data.tag.name}: Collections`,
    description: data => `Collections tagged with ${ data.tag.name } from ${ data.project.display_name }.`,
    ogImage
  }
}
