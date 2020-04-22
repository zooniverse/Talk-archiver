---
layout: default
pagination:
  data: discussions
  resolve: values
  size: 1
  alias: discussion
permalink: "/boards/{{ discussion.board._id }}/discussions/{{ discussion.zooniverse_id}}/"
renderData:
  title: "{{ discussion.title}}"
  description: "{{ discussion.description }}"
---
<div class="subject-page">
<div class="focus container">
{% if discussion.focus and discussion.focus.base_type == 'Subject' %}
<a href="/subjects/{{ discussion.focus.zooniverse_id }}">{{ discussion.focus.zooniverse_id }}</a>
<a href="/subjects/{{ discussion.focus.zooniverse_id }}"><img alt="Subject {{ discussion.focus.zooniverse_id }}" src={{ discussion.focus.location.standard }}></a>
{% endif %}
</div>
<div>
<h1>{{ discussion.title }}</h1>
<p>{{ discussion.description }}</p>
<ul class="container">
{%- for comment in discussion.comments -%}
<li id={{ comment._id }} class="comment">
<a href="/users/{{ comment.user_name }}"><img width=20 height=20 src="https://api.zooniverse.org/talk/avatars/{{ comment.user_zooniverse_id }}" class="avatar" onerror="window.defaultAvatar(this)"></a> by <a href="/users/{{ comment.user_name }}">{{ comment.user_name }}</a> {% if comment.response_to %}<a href="#{{ comment.response_to._id }}">in response to {{ comment.response_to.user_name}}'s comment.</a>{% endif %}

{{ comment.body | safe }}

Posted <time datetime={{ comment.created_at }}>{{ comment.created_at | date }}</time>
</li>
{%- endfor -%}
</ul>
</div>
</div>
