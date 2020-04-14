---
title: Discussion board
layout: default
pagination:
  data: discussions
  size: 1
  alias: discussion
permalink: "/boards/{{ discussion.board._id }}/discussions/{{ discussion.zooniverse_id}}/"
---
<h1 class="text-lg">{{ discussion.title }}</h1>
<p>{{ discussion.description }}</p>
<ul class="container">
{%- for comment in discussion.comments -%}
<li id={{ comment._id }} class="comment">
<a href="/users/{{ comment.user_name }}"><img width=20 height=20 src="https://api.zooniverse.org/talk/avatars/{{ comment.user_zooniverse_id }}" class="avatar" onerror="window.defaultAvatar(this)"></a> by <a href="/users/{{ comment.user_name }}">{{ comment.user_name }}</a> {% if comment.response_to %}<a href="#{{ comment.response_to._id }}">in response to {{ comment.response_to.user_name}}'s comment.</a>{% endif %}

{{ comment.body | safe }}

</li>
{%- endfor -%}
</ul>