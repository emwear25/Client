<template>
  <div class="footer-info">
    <template v-if="!socialOnly">
      <div class="footer-info__brand">
        <h2 class="footer-info__logo">emWear</h2>
        <p class="footer-info__desc">Персонализирани подаръци с грижа и стил.</p>
      </div>
    </template>

    <div v-if="shouldShowSocial" class="footer-info__social">
      <h3 v-if="socialOnly" class="footer-info__social-title">Последвайте ни</h3>
      <div class="footer-info__social-links">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          :aria-label="social.name"
          class="footer-info__social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon :name="social.icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface Props {
  socialOnly?: boolean;
  showSocial?: boolean;
}

const props = defineProps<Props>();

// Show social icons by default, unless explicitly set to false
const shouldShowSocial = computed(() => {
  return props.showSocial !== false;
});

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: "mdi:facebook",
    url: "https://facebook.com/emwear",
  },
  {
    name: "Instagram",
    icon: "mdi:instagram",
    url: "https://instagram.com/emwear",
  },
  {
    name: "TikTok",
    icon: "simple-icons:tiktok",
    url: "https://tiktok.com/@emwear",
  },
];
</script>

<style scoped lang="scss">
.footer-info {
  &__brand {
    margin-bottom: 2rem;

    @media (min-width: 1024px) {
      margin-bottom: 2.5rem;
    }
  }

  &__logo {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    color: white;
    margin: 0 0 1rem 0;
  }

  &__desc {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0;
    max-width: 300px;
  }

  &__social-title {
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    color: white;
    margin: 0 0 1.5rem 0;
  }

  &__social-links {
    display: flex;
    gap: 1rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 18px;

    &:hover {
      background-color: #e67e22;
      color: white;
      transform: translateY(-2px);
    }
  }
}
</style>
