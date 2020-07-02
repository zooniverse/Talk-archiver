function ogImage({ user }) {
  const subject = user.subjects[0];
  return subject ? subject.focus.location.standard : undefined
}

module.exports = {
  eleventyComputed: {
    title: data => `Profile: ${data.user.name}: comments`,
    description: data => `Subject comments by ${data.user.name} from ${data.project.display_name}.`,
    ogImage
  }
}
