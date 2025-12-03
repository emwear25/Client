<template>
  <section class="testimonials">
    <div class="testimonials__container">
      <h2 class="testimonials__heading">Какво казват нашите клиенти</h2>
      <div class="testimonials__grid">
        <div v-for="testimonial in testimonials" :key="testimonial.name" class="testimonials__card">
          <div class="testimonials__quote">
            <Icon name="mdi:format-quote-open" class="testimonials__quote-icon" />
            <p class="testimonials__text">{{ testimonial.quote }}</p>
          </div>
          <div class="testimonials__author">
            <div class="testimonials__avatar">
              <Icon name="mdi:account-circle" />
            </div>
            <div class="testimonials__info">
              <h4 class="testimonials__name">{{ testimonial.name }}</h4>
              <p class="testimonials__location">{{ testimonial.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  name: string;
  quote: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Мария Петрова",
    quote:
      "Синът ми беше в небесата от радост! Качеството е перфектно и персонализацията изглежда много професионално.",
    location: "София",
  },
  {
    name: "Десислава Иванова",
    quote:
      "Поръчах персонализирана тениска за рождения ден на дъщеря ми. Доставката беше бърза и продуктът - великолепен!",
    location: "Пловдив",
  },
  {
    name: "Николай Георгиев",
    quote:
      "Отлично обслужване и внимание към детайла. Определено ще поръчвам отново за специални поводи.",
    location: "Варна",
  },
];
</script>

<style scoped lang="scss">
.testimonials {
  padding: 5rem 0;
  background-color: #fdf7f1;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  &__heading {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin: 0 0 3rem 0;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 4rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }

  &__card {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__quote {
    flex: 1;
  }

  &__quote-icon {
    font-size: 2rem;
    color: #e67e22;
    margin-bottom: 1rem;
    display: block;
  }

  &__text {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1rem;
    color: #555;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  &__avatar {
    font-size: 3rem;
    color: #ddd;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #333;
    margin: 0 0 0.25rem 0;
  }

  &__location {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    color: #888;
    margin: 0;
  }
}
</style>
