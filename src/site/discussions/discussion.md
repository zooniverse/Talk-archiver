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
<ul>
{%- for comment in discussion.comments -%}
<li class="container mb-4 border-b">

{{ comment.body | safe }}

</li>
{%- endfor -%}
</ul>