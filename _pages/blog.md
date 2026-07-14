---
layout: blog-doc
title: Blog
permalink: /blog/
published: false
---

<div class="blog-post-list">
  <h1>Blog</h1>
  <p style="color:var(--custom-muted-fg);margin-bottom:2rem;">Writing on research, data, and human-computer interaction.</p>

  {% for post in site.posts %}
  <div class="post-item" style="margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--custom-border);">
    {% assign category = post.categories.first | default: 'Research' %}
    <span class="post-category category-{{ category | downcase }}">{{ category }}</span>
    <h2 style="font-size:1.125rem;font-weight:500;margin:0.5rem 0 0.25rem;">
      <a href="{{ post.url | relative_url }}" style="color:var(--custom-card-fg);text-decoration:none;">
        {{ post.title }}
      </a>
    </h2>
    <p style="font-size:0.875rem;color:var(--custom-muted-fg);margin:0 0 0.5rem;">
      {{ post.date | date: "%B %d, %Y" }}
      {% if post.tags.size > 0 %}
        &middot;
        {% for tag in post.tags %}
          <span style="margin-left:0.25rem;padding:0.125rem 0.5rem;background:var(--custom-muted);border-radius:9999px;font-size:0.75rem;">{{ tag }}</span>
        {% endfor %}
      {% endif %}
    </p>
    {% if post.excerpt %}
    <p style="color:#374151;font-size:0.9375rem;">{{ post.excerpt | strip_html | truncate: 200 }}</p>
    {% endif %}
  </div>
  {% endfor %}

  {% if site.posts.size == 0 %}
  <p style="color:var(--custom-muted-fg);">No posts yet. Check back soon!</p>
  {% endif %}
</div>
