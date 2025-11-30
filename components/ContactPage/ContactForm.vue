<template>
  <section class="contact-form-section">
    <div class="contact-form-section__container">
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="contact-form__field">
          <label for="name" class="contact-form__label">Име *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="contact-form__input"
            :class="{ 'contact-form__input--error': errors.name }"
            placeholder="Вашето име"
          />
          <span v-if="errors.name" class="contact-form__error">{{
            errors.name
          }}</span>
        </div>

        <div class="contact-form__field">
          <label for="email" class="contact-form__label">Имейл *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="contact-form__input"
            :class="{ 'contact-form__input--error': errors.email }"
            placeholder="your@email.com"
          />
          <span v-if="errors.email" class="contact-form__error">{{
            errors.email
          }}</span>
        </div>

        <div class="contact-form__field">
          <label for="phone" class="contact-form__label">Телефон</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="contact-form__input"
            placeholder="+359 ..."
          />
        </div>

        <div class="contact-form__field">
          <label for="message" class="contact-form__label">Съобщение *</label>
          <textarea
            id="message"
            v-model="formData.message"
            class="contact-form__input contact-form__textarea"
            :class="{ 'contact-form__input--error': errors.message }"
            placeholder="Вашето съобщение..."
            rows="5"
          ></textarea>
          <span v-if="errors.message" class="contact-form__error">{{
            errors.message
          }}</span>
        </div>

        <button
          type="submit"
          class="contact-form__button"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Изпраща се...' : 'Изпрати съобщение' }}
        </button>

        <div v-if="showSuccess" class="contact-form__success">
          ✅ Съобщението е изпратено успешно! Ще се свържем с вас до 24 часа.
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа'),
  email: z.string().email('Моля въведете валиден имейл адрес'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Съобщението трябва да е поне 10 символа'),
})

type ContactFormData = z.infer<typeof contactSchema>

// Reactive data
const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const errors = reactive<Partial<Record<keyof ContactFormData, string>>>({})
const isSubmitting = ref(false)
const showSuccess = ref(false)

// Form submission handler
const handleSubmit = async () => {
  // Clear previous errors
  Object.assign(errors, {
    name: undefined,
    email: undefined,
    phone: undefined,
    message: undefined,
  })

  try {
    // Validate form data
    contactSchema.parse(formData)

    isSubmitting.value = true

    // Simulate API call (replace with actual endpoint)
    await $fetch('http://localhost:3030/api/contact', {
      method: 'POST',
      body: formData,
    }).catch(() => {
      // If API doesn't exist, just simulate success
      return new Promise((resolve) => setTimeout(resolve, 1000))
    })

    // Show success message
    showSuccess.value = true

    // Reset form
    Object.assign(formData, {
      name: '',
      email: '',
      phone: '',
      message: '',
    })

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData
        errors[field] = err.message
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.contact-form-section {
  padding: 3rem 0;
  background-color: #fff;

  &__container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }
}

.contact-form {
  &__field {
    margin-bottom: 1.5rem;
  }

  &__label {
    display: block;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    color: #333;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #e67e22;
    }

    &--error {
      border-color: #e74c3c;
    }

    &::placeholder {
      color: #999;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 120px;
  }

  &__error {
    display: block;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    color: #e74c3c;
    margin-top: 0.25rem;
  }

  &__button {
    width: 100%;
    background: linear-gradient(135deg, #e67e22, #f39c12);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
      background: linear-gradient(135deg, #d35400, #e67e22);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    @media (min-width: 768px) {
      font-size: 1.125rem;
    }
  }

  &__success {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    text-align: center;
  }
}
</style>
