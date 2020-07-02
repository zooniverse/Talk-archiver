function ogImage({ subjects, tag }) {
  const subjectID = tag.subjects[0];
  const subject = subjects[subjectID];
  return subject ? subject.location.standard : undefined;
}

module.exports = {
  eleventyComputed: {
    title: data => `Tag: ${data.tag.name}: Discussions`,
    description: data => `Discussions tagged with ${ data.tag.name } from ${ data.project.display_name }.`,
    ogImage
  }
}
