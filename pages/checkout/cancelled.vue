<template>
  <div class="cancelled-page">
    <div class="cancelled-container">
      <!-- Cancel Icon -->
      <div class="cancelled-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>

      <!-- Cancel Message -->
      <h1 class="cancelled-title">Плащането е отказано</h1>
      <p class="cancelled-message">
        Вашето плащане беше отказано. Не се притеснявайте - не сте таксувани.
      </p>

      <!-- Information -->
      <div class="info-box">
        <h3>Какво се случи?</h3>
        <p>
          Вие отказахте плащането или затворихте прозореца за плащане преди да завършите процеса.
        </p>
        <p>
          Вашата поръчка все още е запазена като чернова. Можете да се върнете към касата и да
          опитате отново.
        </p>
      </div>

      <!-- Actions -->
      <div class="cancelled-actions">
        <NuxtLink to="/checkout" class="btn btn--primary"> Върни се към касата </NuxtLink>
        <NuxtLink to="/cart" class="btn btn--secondary"> Виж количката </NuxtLink>
        <NuxtLink to="/products" class="btn btn--text"> Продължи пазаруването </NuxtLink>
      </div>

      <!-- Support -->
      <div class="support-info">
        <p>
          Имате проблем с плащането?
          <NuxtLink to="/contact">Свържете се с нас</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No special logic needed for cancel page
// User can navigate back to checkout or cart
</script>

<style scoped lang="scss">
.cancelled-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%);
}

.cancelled-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.cancelled-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #ef4444;

  svg {
    width: 100%;
    height: 100%;
  }
}

.cancelled-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.cancelled-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9375rem;
    color: #78350f;
    margin-bottom: 0.5rem;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.cancelled-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;

  &--primary {
    background: #b9c6aa;
    color: white;

    &:hover {
      background: #a8b599;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
    }
  }

  &--secondary {
    background: white;
    color: #b9c6aa;
    border: 2px solid #b9c6aa;

    &:hover {
      background: #f9fafb;
      transform: translateY(-2px);
    }
  }

  &--text {
    background: transparent;
    color: #6b7280;

    &:hover {
      color: #b9c6aa;
    }
  }
}

.support-info {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  a {
    color: #b9c6aa;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 640px) {
  .cancelled-container {
    padding: 2rem 1.5rem;
  }

  .cancelled-title {
    font-size: 1.5rem;
  }
}
</style>
