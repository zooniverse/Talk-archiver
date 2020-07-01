const avatar = require('./avatar');
const awaitAvatars = require('../helpers/avatars');
const moment = require('moment');
const markdown = require('./markdown');
const awaitRoles = require('../helpers/roles')
const slug = require('../helpers/slug');

function responseTo(comment) {
  return `<a href="#${comment._id }">in response to ${comment.user_name}'s comment.</a>`
}

function role(roles, userName) {
  const [ role ] = roles.filter(role => role.name === userName);
  return role ? `<span class="uppercase text-xs"> ${role.roles.join(', ')} </span>` : '';
}

module.exports = async function discussionComment({comment}) {
  const avatars = await awaitAvatars;
  const roles = await awaitRoles;
  const created = moment(comment.created_at).format('LLL');

  return `
    <li id=${ comment._id } class="comment">
      <p>
        <a href="/users/${slug(comment.user_name)}">${avatar(comment.user_name, avatars[comment.user_id])}</a>
        by
        <a href="/users/${slug(comment.user_name)}">${comment.user_name}</a>
        ${ role(roles, comment.user_name) }
        ${ comment.response_to ?  responseTo(comment.response_to) : ''}
      </p>

      ${await markdown(comment.body)}

      <p>Posted <time datetime=${comment.created_at}>${created}</time></p>
    </li>
      `
    }