<template>
  <div class="footer-bottom">
    <div class="footer-bottom__copyright">
      <p class="footer-bottom__text">© emWear {{ currentYear }}. Всички права запазени.</p>
    </div>
    <div class="footer-bottom__right">
      <!-- Payment Methods -->
      <div class="footer-bottom__payments">
        <span class="footer-bottom__payments-text">Приемаме:</span>
        <div class="footer-bottom__payment-icons">
          <div class="footer-bottom__payment-icon" title="VISA">
            <img src="/img/payments/visa.png" alt="VISA" width="40" height="26" />
          </div>
          <div class="footer-bottom__payment-icon" title="Mastercard">
            <img src="/img/payments/card.png" alt="Mastercard" width="40" height="26" />
          </div>
          <div class="footer-bottom__payment-icon" title="Apple Pay">
            <img src="/img/payments/apple-pay.png" alt="Apple Pay" width="40" height="26" />
          </div>
        </div>
      </div>
      <!-- Social Media -->
      <div class="footer-bottom__social">
        <span class="footer-bottom__social-text">Последвайте ни:</span>
        <div class="footer-bottom__social-icons">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            :aria-label="social.name"
            class="footer-bottom__icon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon :name="social.icon" />
          </a>
        </div>
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

const currentYear = new Date().getFullYear();

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: "mdi:facebook",
    url: "https://www.facebook.com/emwearbg/",
  },
  {
    name: "Instagram",
    icon: "mdi:instagram",
    url: "https://www.instagram.com/emwea.r/",
  },
  {
    name: "TikTok",
    icon: "simple-icons:tiktok",
    url: "https://www.tiktok.com/@emwear.bg",
  },
];
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;

  @include up(md) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  &__copyright {
    // No additional styles needed
  }

  &__text {
    font-family: $font-body;
    font-weight: 400;
    font-size: 0.875rem;
    color: rgba($color-white, 0.6);
    margin: 0;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    @include up(md) {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
  }

  &__payments {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    @include up(md) {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__payments-text {
    font-family: $font-body;
    font-weight: 400;
    font-size: 0.875rem;
    color: rgba($color-white, 0.7);
    white-space: nowrap;
  }

  &__payment-icons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__payment-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 26px;
    background: rgba($color-white, 0.1);
    border-radius: 4px;
    padding: 4px;
    transition: transform 0.2s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    &:hover {
      transform: scale(1.05);
      background: rgba($color-white, 0.15);
    }
  }

  &__social {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__social-text {
    font-family: $font-body;
    font-weight: 400;
    font-size: 0.875rem;
    color: rgba($color-white, 0.7);
  }

  &__social-icons {
    display: flex;
    gap: 0.75rem;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba($brand, 0.2);
    border: 1px solid rgba($color-white, 0.1);
    border-radius: 50%;
    color: $color-white;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 18px;

    &:hover {
      background: $brand-accent-1;
      border-color: $brand-accent-1;
      color: $brand-ink;
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid $brand;
      outline-offset: 2px;
    }
  }
}
</style>
