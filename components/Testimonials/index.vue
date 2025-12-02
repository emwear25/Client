<template>
  <section class="testimonials">
    <div class="testimonials__container">
      <div class="testimonials__header">
        <span class="testimonials__eyebrow">Отзиви</span>
        <h2 class="testimonials__heading">Какво казват нашите клиенти</h2>
        <p class="testimonials__intro">
          Радваме се да споделим историите на хората, които избраха да направят
          своите моменти специални с emWear
        </p>
      </div>

      <div class="testimonials__grid">
        <article
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="testimonial-card"
        >
          <div class="testimonial-card__header">
            <div class="testimonial-card__avatar">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="testimonial-card__avatar-img"
              />
            </div>
            <div class="testimonial-card__info">
              <h3 class="testimonial-card__name">{{ testimonial.name }}</h3>
              <div class="testimonial-card__meta">
                <span class="testimonial-card__product">{{
                  testimonial.product
                }}</span>
                <span class="testimonial-card__separator">•</span>
                <span class="testimonial-card__date">{{
                  testimonial.date
                }}</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card__rating">
            <Icon
              v-for="star in 5"
              :key="star"
              name="mdi:star"
              class="testimonial-card__star"
              :class="{
                'testimonial-card__star--filled': star <= testimonial.rating,
              }"
            />
          </div>

          <blockquote class="testimonial-card__quote">
            <Icon
              name="mdi:format-quote-open"
              class="testimonial-card__quote-icon"
            />
            <p class="testimonial-card__text">{{ testimonial.text }}</p>
          </blockquote>

          <div class="testimonial-card__footer" v-if="testimonial.verified">
            <div class="testimonial-card__badge">
              <Icon
                name="mdi:check-decagram"
                class="testimonial-card__badge-icon"
              />
              <span class="testimonial-card__badge-text"
                >Потвърдена покупка</span
              >
            </div>
          </div>
        </article>
      </div>

      <div class="testimonials__cta">
        <p class="testimonials__cta-text">
          Искате да споделите вашето преживяване?
        </p>
        <a href="#contact" class="btn btn--ghost">Напишете ни отзив</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  id: number
  name: string
  avatar: string
  product: string
  date: string
  rating: number
  text: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Мария Петрова',
    avatar: 'https://i.pravatar.cc/150?img=5',
    product: 'Персонализирана раница',
    date: 'Ноември 2024',
    rating: 5,
    text: 'Страхотно качество и изключително внимание към детайла! Моята дъщеря беше в екстаз от раницата с нейното име. Бродерията е перфектна и цветовете са точно такива, каквито поисках. Препоръчвам топло!',
    verified: true,
  },
  {
    id: 2,
    name: 'Георги Иванов',
    avatar: 'https://i.pravatar.cc/150?img=12',
    product: 'Персонализирана тениска',
    date: 'Октомври 2024',
    rating: 5,
    text: 'Поръчах тениска за рождения ден на сина ми и резултатът надмина всички очаквания! Севал беше изключително отзивчива и ми помогна да избера най-добрия дизайн. Перфектен подарък!',
    verified: true,
  },
  {
    id: 3,
    name: 'Елена Димитрова',
    avatar: 'https://i.pravatar.cc/150?img=9',
    product: 'Комплект раница + несесер',
    date: 'Септември 2024',
    rating: 5,
    text: 'Невероятни продукти! Комплектът е толкова красив и качествен. Бродерията е изпълнена прецизно и изглежда толкова професионално. Определено ще поръчам отново за подаръци!',
    verified: true,
  },
  {
    id: 4,
    name: 'Иван Стоянов',
    avatar: 'https://i.pravatar.cc/150?img=15',
    product: 'Персонализирана кърпа',
    date: 'Август 2024',
    rating: 5,
    text: 'Много доволен от покупката! Кърпата е с отлично качество, а името е бродирано много красиво. Идеална за плажа и басейна. Благодаря за прекрасната работа!',
    verified: true,
  },
  {
    id: 5,
    name: 'Десислава Георгиева',
    avatar: 'https://i.pravatar.cc/150?img=16',
    product: 'Детска блуза с име',
    date: 'Юли 2024',
    rating: 5,
    text: 'Много съм впечатлена от качеството! Блузата е много мека и удобна, а бродерията изглежда страхотно. Дъщеря ми я обича и иска да я носи всеки ден. Браво!',
    verified: true,
  },
  {
    id: 6,
    name: 'Николай Василев',
    avatar: 'https://i.pravatar.cc/150?img=13',
    product: 'Персонализиран суитчър',
    date: 'Юни 2024',
    rating: 5,
    text: 'Поръчах суитчър за племенника си и той беше в чист възторг! Качеството е отлично, а доставката беше бърза. Със сигурност ще препоръчам на приятели и роднини!',
    verified: true,
  },
]
</script>

<style scoped lang="scss">
@use '~/assets/styles/colors' as *;
@use '~/assets/styles/breakpoints' as *;
@use '~/assets/styles/fonts' as *;

.testimonials {
  padding: 4rem 0;
  background: $bg-page;
  position: relative;
  overflow: hidden;

  @include up(md) {
    padding: 5rem 0;
  }

  @include up(lg) {
    padding: 6rem 0;
  }

  // Decorative elements
  &::before {
    content: '';
    position: absolute;
    top: -15%;
    right: -8%;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      rgba($brand-accent-2, 0.12) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }

  &__container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 16px;
    position: relative;
    z-index: 1;

    @include up(md) {
      max-width: 1104px;
      padding-inline: 20px;
    }
    @include up(lg) {
      max-width: 1472px;
      padding-inline: 24px;
    }
    @include up(xl) {
      max-width: 1656px;
      padding-inline: 32px;
    }
  }

  &__header {
    text-align: center;
    max-width: 828px;
    margin: 0 auto 3rem;

    @include up(md) {
      margin-bottom: 4rem;
    }
  }

  &__eyebrow {
    display: inline-block;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand;
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__heading {
    font-family: $font-heading;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 2.75rem);
    color: $brand-ink;
    margin: 0 0 1rem 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  &__intro {
    font-family: $font-body;
    font-size: 1.0625rem;
    color: $text-secondary;
    line-height: 1.7;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3rem;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @include up(lg) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }
  }

  &__cta {
    text-align: center;
    padding: 2.5rem 1.5rem;
    background: $bg-card;
    border-radius: 16px;
    border: 2px dashed $border-base;
    max-width: 690px;
    margin: 0 auto;

    @include up(md) {
      padding: 3rem 2rem;
    }
  }

  &__cta-text {
    font-family: $font-body;
    font-size: 1.125rem;
    color: $text-primary;
    font-weight: 500;
    margin: 0 0 1.5rem 0;
  }
}

.testimonial-card {
  background: $bg-card;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid $border-base;
  box-shadow: 0 6px 16px $shadow-soft;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px $shadow-med;
    border-color: $brand;
  }

  // Decorative corner
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      transparent 50%,
      rgba($brand, 0.08) 50%
    );
    border-top-right-radius: 14px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid $brand;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba($brand, 0.2);
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-family: $font-body;
    font-size: 0.8125rem;
    color: $text-secondary;
  }

  &__product {
    font-weight: 500;
  }

  &__separator {
    color: $border-base;
  }

  &__date {
    color: $text-secondary;
  }

  &__rating {
    display: flex;
    gap: 4px;
  }

  &__star {
    width: 18px;
    height: 18px;
    color: $border-base;
    transition: color 0.2s ease;

    &--filled {
      color: $brand-accent-3;
    }
  }

  &__quote {
    position: relative;
    margin: 0;
    padding: 0;
  }

  &__quote-icon {
    position: absolute;
    top: -8px;
    left: -8px;
    width: 32px;
    height: 32px;
    color: rgba($brand, 0.15);
    pointer-events: none;
  }

  &__text {
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $text-primary;
    line-height: 1.7;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  &__footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid $border-base;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba($success, 0.1);
    border: 1px solid rgba($success, 0.3);
    border-radius: 20px;
    font-family: $font-body;
    font-size: 0.75rem;
    font-weight: 600;
    color: $success;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__badge-icon {
    width: 14px;
    height: 14px;
  }
}
</style>
