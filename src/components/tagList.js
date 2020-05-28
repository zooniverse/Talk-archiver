module.exports = function tagList(tags) {
  return `
    <ul class="tag-list">
      ${tags.map(tag => `<li><a href="/tags/${ tag._id }">${ tag._id }</a></li>`).join('\n')}
    </ul>
  `
}
