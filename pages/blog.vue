<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <PageHero
      title="Блог"
      subtitle="Полезни статии за персонализирани подаръци, идеи и вдъхновение"
    />

    <div class="container">

      <!-- Tags Filter -->
      <div v-if="tags.length > 0" class="blog-page__tags">
        <button
          class="tag-filter"
          :class="{ 'tag-filter--active': !selectedTag }"
          @click="filterByTag(null)"
        >
          Всички
        </button>
        <button
          v-for="tag in tags"
          :key="tag.name"
          class="tag-filter"
          :class="{ 'tag-filter--active': selectedTag === tag.name }"
          @click="filterByTag(tag.name)"
        >
          {{ tag.name }} ({{ tag.count }})
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="blog-page__loading">
        <div class="spinner"></div>
        <p>Зареждане на статии...</p>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles.length > 0" class="blog-page__grid">
        <article v-for="article in articles" :key="article._id" class="article-card">
          <NuxtLink :to="`/blog/${article.slug}`" class="article-card__link">
            <div class="article-card__image-wrapper">
              <img
                v-if="article.featuredImage?.url"
                :src="article.featuredImage.url"
                :alt="article.featuredImage.alt || article.title"
                class="article-card__image"
              />
              <div v-else class="article-card__placeholder">
                <span>📝</span>
              </div>
            </div>
            <div class="article-card__content">
              <div class="article-card__meta">
                <time :datetime="article.publishedAt">
                  {{ formatDate(article.publishedAt) }}
                </time>
                <span class="article-card__reading-time">
                  {{ article.readingTime }} мин четене
                </span>
              </div>
              <h2 class="article-card__title">{{ article.title }}</h2>
              <p class="article-card__excerpt">{{ article.excerpt }}</p>
              <div v-if="article.tags?.length" class="article-card__tags">
                <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="blog-page__empty">
        <span class="blog-page__empty-icon">📝</span>
        <h3>Няма намерени статии</h3>
        <p v-if="selectedTag">Опитайте да изберете друг таг или вижте всички статии.</p>
        <p v-else>Скоро ще добавим интересни статии и новини.</p>
        <button v-if="selectedTag" class="btn btn--primary" @click="filterByTag(null)">
          Виж всички статии
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="blog-page__pagination">
        <button
          class="btn btn--secondary"
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
        >
          ← Предишна
        </button>
        <span class="pagination-info">
          Страница {{ pagination.page }} от {{ pagination.pages }}
        </span>
        <button
          class="btn btn--secondary"
          :disabled="pagination.page >= pagination.pages"
          @click="changePage(pagination.page + 1)"
        >
          Следваща →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePageSEO } from "~/composables/useSEO";
import PageHero from "~/components/common/PageHero.vue";

const route = useRoute();
const router = useRouter();

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: { url: string; alt: string };
  publishedAt: string;
  readingTime: number;
  tags: string[];
}

interface Tag {
  name: string;
  count: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

const articles = ref<Article[]>([]);
const tags = ref<Tag[]>([]);
const loading = ref(true);
const selectedTag = ref<string | null>(null);
const pagination = ref<Pagination>({
  page: 1,
  limit: 9,
  total: 0,
  pages: 0,
  hasMore: false,
});

// SEO
usePageSEO({
  title: selectedTag.value ? `Блог - ${selectedTag.value}` : "Блог",
  description:
    "Полезни статии за персонализирани подаръци, идеи за подаръци, съвети за избор и вдъхновение от emWear.",
  type: "website",
});

// Add Blog structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "emWear Блог",
        description: "Полезни статии за персонализирани подаръци и вдъхновение",
        url: "https://emwear.bg/blog",
      }),
    },
  ],
});

const fetchArticles = async (page = 1) => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "9");
    if (selectedTag.value) {
      params.append("tag", selectedTag.value);
    }

    const response = await $fetch(`/api/articles?${params.toString()}`);
    if (response.success) {
      articles.value = response.data.articles;
      pagination.value = response.data.pagination;
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    loading.value = false;
  }
};

const fetchTags = async () => {
  try {
    const response = await $fetch("/api/articles/tags");
    if (response.success) {
      tags.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

const filterByTag = (tag: string | null) => {
  selectedTag.value = tag;
  router.push({ query: tag ? { tag } : {} });
  fetchArticles(1);
};

const changePage = (page: number) => {
  router.push({ query: { ...route.query, page: String(page) } });
  fetchArticles(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Watch for query changes
watch(
  () => route.query,
  (query) => {
    const page = parseInt(String(query.page || "1"));
    const tag = query.tag ? String(query.tag) : null;
    if (tag !== selectedTag.value) {
      selectedTag.value = tag;
    }
    fetchArticles(page);
  }
);

onMounted(() => {
  const page = parseInt(String(route.query.page || "1"));
  const tag = route.query.tag ? String(route.query.tag) : null;
  selectedTag.value = tag;
  fetchArticles(page);
  fetchTags();
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.blog-page {
  min-height: 60vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;

  .container {
    padding: 4rem 1rem;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 3rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  &__loading,
  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    color: $text-secondary;
  }

  &__empty-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 3rem;
  }
}

.tag-filter {
  padding: 0.5rem 1rem;
  border: 2px solid $border-base;
  border-radius: 9999px;
  background: white;
  color: $text-secondary;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $brand;
    color: $brand;
  }

  &--active {
    background: $brand;
    border-color: $brand;
    color: white;
  }
}

.article-card {
  background: white;
  border-radius: 0; // Sharp corners
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid $border-base;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: $brand;

    .article-card__image {
      transform: scale(1.02);
    }
  }

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  &__image-wrapper {
    position: relative;
    padding-top: 60%; // 5:3 aspect ratio
    overflow: hidden;
    background: $bg-page;
    border-bottom: 2px solid $border-base;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
    font-size: 4rem;
    background: linear-gradient(135deg, $bg-page 0%, darken($bg-page, 3%) 100%);
    color: $text-tertiary;
  }

  &__content {
    padding: 2rem 1.75rem;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.8125rem;
    color: $text-secondary;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    time {
      font-weight: 600;
      color: $brand;
    }
  }

  &__reading-time {
    &::before {
      content: "•";
      margin-right: 0.5rem;
      color: $border-base;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 1rem;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  &__excerpt {
    font-family: $font-body;
    color: $text-secondary;
    margin: 0 0 1.5rem;
    line-height: 1.7;
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid $border-base;
  }
}

.article-tag {
  padding: 0.375rem 0.875rem;
  background: $bg-page;
  color: $text-secondary;
  border-radius: 0; // Sharp corners
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid $border-base;
  transition: all 0.2s;

  &:hover {
    background: $brand-ink;
    color: white;
    border-color: $brand-ink;
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
      background: $brand-hover;
    }
  }

  &--secondary {
    background: $bg-page;
    color: $text-primary;

    &:hover:not(:disabled) {
      background: darken($bg-page, 5%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.pagination-info {
  color: $text-secondary;
  font-size: 0.875rem;
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $border-base;
  border-top-color: $brand;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
