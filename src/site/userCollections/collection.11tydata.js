function ogImage({ userCollection }) {
  const subject = userCollection.subjects && userCollection.subjects[0];
  return subject ? subject.location.standard : undefined
}

module.exports = {
  eleventyComputed: {
    title: data => data.userCollection.title,
    description: data => data.userCollection.description,
    ogImage
  }
}
