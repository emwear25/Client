<template>
  <section class="contact-details">
    <div class="contact-details__container">
      <div class="contact-details__grid">
        <div class="contact-details__info">
          <h2 class="contact-details__heading">Как да се свържете с нас</h2>

          <div class="contact-details__item">
            <div class="contact-details__icon">
              <Icon name="mdi:phone" />
            </div>
            <div class="contact-details__content">
              <h3 class="contact-details__label">Телефон</h3>
              <a href="tel:+359890927520" class="contact-details__link">
                +359 89 092 7520
              </a>
            </div>
          </div>

          <div class="contact-details__item">
            <div class="contact-details__icon">
              <Icon name="mdi:email" />
            </div>
            <div class="contact-details__content">
              <h3 class="contact-details__label">Имейл</h3>
              <a href="mailto:info@emwear.bg" class="contact-details__link">
                info@emwear.bg
              </a>
            </div>
          </div>
        </div>

        <div class="contact-details__social">
          <h3 class="contact-details__social-heading">Последвайте ни:</h3>
          <div class="contact-details__social-icons">
            <a
              href="#"
              class="contact-details__social-link"
              aria-label="Facebook"
            >
              <Icon name="simple-icons:facebook" />
            </a>
            <a
              href="#"
              class="contact-details__social-link"
              aria-label="Instagram"
            >
              <Icon name="simple-icons:instagram" />
            </a>
            <a
              href="#"
              class="contact-details__social-link"
              aria-label="TikTok"
            >
              <Icon name="simple-icons:tiktok" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.contact-details {
  padding: 3rem 0;
  background-color: #fafafa;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
  }

  &__heading {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    color: #333;
    margin: 0 0 2rem 0;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  &__icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__label {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__link {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 1.125rem;
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #e67e22;
    }
  }

  &__social {
    text-align: right;

    @media (max-width: 767px) {
      text-align: center;
    }
  }

  &__social-heading {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1.125rem;
    color: #333;
    margin: 0 0 1.5rem 0;
  }

  &__social-icons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    @media (max-width: 767px) {
      justify-content: center;
    }
  }

  &__social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 18px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      background: linear-gradient(135deg, #e67e22, #f39c12);
      color: #fff;
    }
  }
}
</style>
