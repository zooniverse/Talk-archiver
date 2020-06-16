// console.log("Elevenpack javascript is loaded");
import slug from '../helpers/slug';

function rewriteHashes(hash) {
  const paths = hash.split('/');
  switch (paths[1]) {
    case "subjects":
    case "collections": {
      return `/${paths[1]}/${paths[2]}/`;
    }
    case "users": {
      return `/${paths[1]}/${slug(paths[2])}/`;
    }
  }
  /*
    tag fragments are of the form
    #/search?tags[sometag]=true
  */
  if (paths[1].startsWith('search?tags')) {
    const search = paths[1].split('?');
    const params = search[1];
    const tagMatch = /tags\[(\w+)\]=true/;
    const matches = params.match(tagMatch);
    const tag = matches[1];
    return tag ? `/tags/${tag}/` : '';
  }

  return '';
}

function onLoad() {
  const { hash } = window.location;
  if (hash.startsWith('#/')) {
    const redirectPath = rewriteHashes(hash);
    if (redirectPath.length) {
      window.location.replace(`${window.location.origin}${redirectPath}`);
    }
  }
}

window.addEventListener('load', onLoad);

