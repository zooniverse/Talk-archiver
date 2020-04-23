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
<div class="page-grid">
<div class="focus container">
{% if discussion.focus and discussion.focus.base_type == 'Subject' %}
<a href="/subjects/{{ discussion.focus.zooniverse_id }}">{{ discussion.focus.zooniverse_id }}</a>
<a href="/subjects/{{ discussion.focus.zooniverse_id }}"><img alt="Subject {{ discussion.focus.zooniverse_id }}" src={{ discussion.focus.location.standard }}></a>
{% endif %}
{% if discussion.focus and discussion.focus.base_type == 'Collection' %}
<a href="/collections/{{ discussion.focus.zooniverse_id }}">{{ discussion.focus.zooniverse_id }}</a>
<ul class="collection">
{%- for subject in discussion.focus.subjects | limit(4) -%}
<li id={{ subject.zooniverse_id }} class="subject">
<a href="/subjects/{{ subject.zooniverse_id }}"><img src={{ subject.location.thumb}}></a>
</li>
{%- endfor -%}
</ul>
{% endif %}
</div>
<div>
<h1>{{ discussion.title }}</h1>
<p>{{ discussion.description }}</p>
<ul class="container">
{%- for comment in discussion.comments -%}
<li id={{ comment._id }} class="comment">
<a href="/users/{{ comment.user_name }}">{% avatar comment.user_name, users[comment.user_zooniverse_id].avatar_url %}</a> by <a href="/users/{{ comment.user_name }}">{{ comment.user_name }}</a> {% if comment.response_to %}<a href="#{{ comment.response_to._id }}">in response to {{ comment.response_to.user_name}}'s comment.</a>{% endif %}

{{ comment.body | safe }}

Posted <time datetime={{ comment.created_at }}>{{ comment.created_at | date }}</time>
</li>
{%- endfor -%}
</ul>
</div>
</div>
