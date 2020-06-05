const awaitProject = require('../helpers/project');

function metaDesc(description) {
  return `
    <meta name="description" content="${ description }" />
    <meta name='twitter:description' content="${ description }" />
    <meta property='og:description' content="${ description }" />
  `;
}

function metaImage(ogImage) {
  return `
    <meta property='og:image' content="${ ogImage }" />
    <meta name='twitter:image' content="${ ogImage }" />
  `;
}

module.exports = async function({ page, title, description, ogImage }){
  const project = await awaitProject;
  return `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${ project.display_name } Talk" />
    <meta property='og:url' content="https://talk.${ project.domain }${ page.url }" />
    <meta property='og:title' content="${ title }" />

    ${ description ? metaDesc(description) : ''}

    ${ ogImage ? metaImage(ogImage) : ''}

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="@the_zooniverse" />
    <meta name="twitter:site" content="@the_zooniverse" />

    <link rel="icon" href="/img/favicon.ico">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Karla:400,700">
    <title>${ title }</title>
  `
};
