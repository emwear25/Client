<template>
  <div v-if="article" class="article-page">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <NuxtLink to="/">Начало</NuxtLink>
        <span class="breadcrumbs__separator">›</span>
        <NuxtLink to="/blog">Блог</NuxtLink>
        <span class="breadcrumbs__separator">›</span>
        <span class="breadcrumbs__current">{{ article.title }}</span>
      </nav>

      <!-- Article Header -->
      <header class="article-header">
        <h1 class="article-header__title">{{ article.title }}</h1>
        <div class="article-header__meta">
          <time :datetime="article.publishedAt">
            {{ formatDate(article.publishedAt) }}
          </time>
          <span class="article-header__separator">•</span>
          <span>{{ article.readingTime }} мин четене</span>
          <span class="article-header__separator">•</span>
          <span>{{ article.views }} прегледа</span>
        </div>
        <div v-if="article.author?.name" class="article-header__author">
          <span>От {{ article.author.name }}</span>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="article.featuredImage?.url" class="article-featured-image">
        <img
          :src="article.featuredImage.url"
          :alt="article.featuredImage.alt || article.title"
        />
      </div>

      <!-- Article Content -->
      <article class="article-content" v-html="article.content"></article>

      <!-- Tags -->
      <div v-if="article.tags?.length" class="article-tags">
        <span class="article-tags__label">Тагове:</span>
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/blog?tag=${tag}`"
          class="article-tag"
        >
          {{ tag }}
        </NuxtLink>
      </div>

      <!-- Share Buttons -->
      <div class="article-share">
        <span class="article-share__label">Сподели:</span>
        <button class="share-btn share-btn--facebook" @click="shareOnFacebook">
          <span>Facebook</span>
        </button>
        <button class="share-btn share-btn--twitter" @click="shareOnTwitter">
          <span>Twitter</span>
        </button>
        <button class="share-btn share-btn--linkedin" @click="shareOnLinkedIn">
          <span>LinkedIn</span>
        </button>
        <button class="share-btn share-btn--copy" @click="copyLink">
          <span>{{ linkCopied ? "Копирано!" : "Копирай линк" }}</span>
        </button>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length > 0" class="related-articles">
        <h2 class="related-articles__title">Свързани статии</h2>
        <div class="related-articles__grid">
          <article v-for="related in relatedArticles" :key="related._id" class="related-card">
            <NuxtLink :to="`/blog/${related.slug}`" class="related-card__link">
              <div class="related-card__image-wrapper">
                <img
                  v-if="related.featuredImage?.url"
                  :src="related.featuredImage.url"
                  :alt="related.title"
                  class="related-card__image"
                />
                <div v-else class="related-card__placeholder">📝</div>
              </div>
              <div class="related-card__content">
                <h3 class="related-card__title">{{ related.title }}</h3>
                <p class="related-card__excerpt">{{ related.excerpt }}</p>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="article-loading">
    <div class="spinner"></div>
    <p>Зареждане на статията...</p>
  </div>

  <!-- Error State -->
  <div v-else class="article-error">
    <h2>Статията не е намерена</h2>
    <p>Съжаляваме, но тази статия не съществува или е била премахната.</p>
    <NuxtLink to="/blog" class="btn btn--primary">Към блога</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { usePageSEO } from "~/composables/useSEO";

const route = useRoute();

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: { url: string; alt: string };
  author?: { name: string };
  tags: string[];
  publishedAt: string;
  readingTime: number;
  views: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: { url: string };
  publishedAt: string;
  readingTime: number;
}

const article = ref<Article | null>(null);
const relatedArticles = ref<RelatedArticle[]>([]);
const loading = ref(true);
const linkCopied = ref(false);

const articleUrl = computed(() => {
  if (!article.value) return "";
  return `https://emwear.bg/blog/${article.value.slug}`;
});

const fetchArticle = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`/api/articles/${route.params.slug}`);
    if (response.success) {
      article.value = response.data.article;
      relatedArticles.value = response.data.relatedArticles || [];

      // Set SEO
      usePageSEO({
        title: article.value.seo?.metaTitle || article.value.title,
        description: article.value.seo?.metaDescription || article.value.excerpt,
        type: "article",
        image: article.value.seo?.ogImage || article.value.featuredImage?.url,
      });

      // Add BlogPosting structured data
      useHead({
        script: [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: article.value.title,
              image: article.value.featuredImage?.url,
              datePublished: article.value.publishedAt,
              dateModified: article.value.publishedAt,
              author: {
                "@type": "Person",
                name: article.value.author?.name || "emWear",
              },
              publisher: {
                "@type": "Organization",
                name: "emWear",
                logo: {
                  "@type": "ImageObject",
                  url: "https://emwear.bg/logo.png",
                },
              },
              description: article.value.excerpt,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": articleUrl.value,
              },
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Начало",
                  item: "https://emwear.bg",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Блог",
                  item: "https://emwear.bg/blog",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: article.value.title,
                  item: articleUrl.value,
                },
              ],
            }),
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error fetching article:", error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const shareOnFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl.value)}`,
    "_blank",
    "width=600,height=400"
  );
};

const shareOnTwitter = () => {
  const text = article.value?.title || "";
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl.value)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "width=600,height=400"
  );
};

const shareOnLinkedIn = () => {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl.value)}`,
    "_blank",
    "width=600,height=400"
  );
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(articleUrl.value);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy link:", error);
  }
};

onMounted(() => {
  fetchArticle();
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.article-page {
  padding: 2rem 1rem 4rem;
  max-width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: $text-secondary;

  a {
    color: $text-secondary;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $brand;
    }
  }

  &__separator {
    color: $border-base;
  }

  &__current {
    color: $text-primary;
    font-weight: 500;
  }
}

.article-header {
  margin-bottom: 2rem;

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 5vw, 3rem);
    color: $brand-ink;
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: $text-secondary;
    margin-bottom: 0.5rem;
  }

  &__separator {
    color: $border-base;
  }

  &__author {
    font-size: 0.875rem;
    color: $text-secondary;
    font-weight: 500;
  }
}

.article-featured-image {
  margin-bottom: 3rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.article-content {
  font-family: $font-body;
  font-size: 1.125rem;
  line-height: 1.8;
  color: $text-primary;
  margin-bottom: 3rem;

  :deep(h2) {
    font-family: $font-heading;
    font-size: 2rem;
    color: $brand-ink;
    margin: 2.5rem 0 1rem;
    line-height: 1.3;
  }

  :deep(h3) {
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $brand-ink;
    margin: 2rem 0 0.75rem;
    line-height: 1.3;
  }

  :deep(p) {
    margin: 1.25rem 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 1.25rem 0;
    padding-left: 2rem;

    li {
      margin: 0.5rem 0;
    }
  }

  :deep(a) {
    color: $brand;
    text-decoration: underline;

    &:hover {
      color: darken($brand, 10%);
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :deep(blockquote) {
    border-left: 4px solid $brand;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: $text-secondary;
  }

  :deep(code) {
    background: $bg-page;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: monospace;
  }

  :deep(pre) {
    background: $bg-page;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;

    code {
      background: none;
      padding: 0;
    }
  }
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid $border-base;
  border-bottom: 1px solid $border-base;
  margin-bottom: 2rem;

  &__label {
    font-weight: 600;
    color: $text-secondary;
  }
}

.article-tag {
  padding: 0.5rem 1rem;
  background: $bg-page;
  color: $text-secondary;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: $brand;
    color: white;
  }
}

.article-share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;

  &__label {
    font-weight: 600;
    color: $text-secondary;
  }
}

.share-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &--facebook {
    background: #1877f2;
    color: white;

    &:hover {
      background: darken(#1877f2, 10%);
    }
  }

  &--twitter {
    background: #1da1f2;
    color: white;

    &:hover {
      background: darken(#1da1f2, 10%);
    }
  }

  &--linkedin {
    background: #0077b5;
    color: white;

    &:hover {
      background: darken(#0077b5, 10%);
    }
  }

  &--copy {
    background: $bg-page;
    color: $text-primary;

    &:hover {
      background: darken($bg-page, 5%);
    }
  }
}

.related-articles {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid $border-base;

  &__title {
    font-family: $font-heading;
    font-size: 2rem;
    color: $brand-ink;
    margin: 0 0 2rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

.related-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  &__image-wrapper {
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;
    background: $bg-page;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  }

  &__content {
    padding: 1rem;
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.125rem;
    color: $brand-ink;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }

  &__excerpt {
    font-size: 0.875rem;
    color: $text-secondary;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.article-loading,
.article-error {
  text-align: center;
  padding: 4rem 2rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $border-base;
  border-top-color: $brand;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &--primary {
    background: $brand;
    color: white;

    &:hover {
      background: darken($brand, 10%);
    }
  }
}
</style>
