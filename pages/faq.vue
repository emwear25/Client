<template>
  <div class="faq-page">
    <div class="faq-page__container">
      <!-- Header -->
      <header class="faq-page__header">
        <h1 class="faq-page__title">Често Задавани Въпроси</h1>
        <p class="faq-page__subtitle">
          Отговори на най-често срещаните въпроси за персонализираните продукти с бродерия от emWear
        </p>
      </header>

      <!-- FAQ Categories -->
      <div class="faq-page__categories">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['faq-page__category-btn', { 'faq-page__category-btn--active': activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- FAQ Items -->
      <div class="faq-page__items">
        <article
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="faq-page__item"
          itemscope
          itemprop="mainEntity"
          itemtype="https://schema.org/Question"
        >
          <button
            class="faq-page__question"
            :class="{ 'faq-page__question--open': openItems.includes(index) }"
            @click="toggleItem(index)"
          >
            <h2 class="faq-page__question-text" itemprop="name">{{ faq.question }}</h2>
            <svg class="faq-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            v-show="openItems.includes(index)"
            class="faq-page__answer"
            itemscope
            itemprop="acceptedAnswer"
            itemtype="https://schema.org/Answer"
          >
            <div class="faq-page__answer-text" itemprop="text" v-html="faq.answer"></div>
          </div>
        </article>
      </div>

      <!-- Contact CTA -->
      <div class="faq-page__cta">
        <h3 class="faq-page__cta-title">Не намерихте отговор на въпроса си?</h3>
        <p class="faq-page__cta-text">Свържете се с нас и ще се радваме да ви помогнем!</p>
        <NuxtLink to="/contact" class="faq-page__cta-button">
          Свържете се с нас
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from '~/composables/useSEO';

// SEO
usePageSEO({
  title: 'Често Задавани Въпроси - emWear',
  description: 'Отговори на често задавани въпроси за персонализирани продукти с бродерия, поръчки, доставка, връщане и качество на изработка.',
});

// Categories
const categories = [
  { id: 'all', name: 'Всички' },
  { id: 'orders', name: 'Поръчки' },
  { id: 'personalization', name: 'Персонализация' },
  { id: 'delivery', name: 'Доставка' },
  { id: 'returns', name: 'Връщане' },
  { id: 'quality', name: 'Качество' },
];

const activeCategory = ref('all');
const openItems = ref<number[]>([]);

// FAQ Data
const faqs = [
  // Orders
  {
    category: 'orders',
    question: 'Как мога да направя поръчка?',
    answer: `<p>Поръчката е лесна и бърза:</p>
      <ol>
        <li>Изберете желания продукт от нашия каталог</li>
        <li>Изберете размер и цвят</li>
        <li>Въведете името за бродерия в полето за персонализация</li>
        <li>Изберете шрифт и цвят на конеца</li>
        <li>Добавете продукта в количката</li>
        <li>Попълнете данните за доставка и завършете поръчката</li>
      </ol>
      <p>След потвърждение на поръчката ще получите имейл с детайли.</p>`
  },
  {
    category: 'orders',
    question: 'Колко време отнема изработката на поръчката?',
    answer: `<p><strong>Стандартна изработка: 1-2 работни дни</strong></p>
      <p>Всяка поръчка се изработва индивидуално с машинна бродерия. След изработката продуктът се изпраща с куриер.</p>
      <p><strong>Общо време до получаване:</strong></p>
      <ul>
        <li>София: 2-3 дни</li>
        <li>Други градове: 3-4 дни</li>
      </ul>
      <p>При спешни поръчки, моля свържете се с нас на <a href="tel:+359894366008">+359 894 366 008</a></p>`
  },
  {
    category: 'orders',
    question: 'Мога ли да променя или отменя поръчката си?',
    answer: `<p>Да, можете да промените или отмените поръчката си, но само преди да е започнала изработката.</p>
      <p><strong>Как да промените поръчка:</strong></p>
      <ol>
        <li>Свържете се с нас незабавно на <a href="mailto:info@emwear.bg">info@emwear.bg</a></li>
        <li>Посочете номера на поръчката</li>
        <li>Опишете желаната промяна</li>
      </ol>
      <p><strong>Важно:</strong> След като поръчката е изпратена за изработка, промени не са възможни, тъй като продуктът е персонализиран специално за вас.</p>`
  },
  {
    category: 'orders',
    question: 'Какви методи за плащане приемате?',
    answer: `<p>Приемаме следните методи за плащане:</p>
      <ul>
        <li><strong>Наложен платеж</strong> - Плащате при получаване на куриера (без такса)</li>
        <li><strong>Банкова карта онлайн</strong> - Visa, Mastercard, Maestro чрез Stripe (сигурно плащане)</li>
        <li><strong>Apple Pay</strong> - За бързо и удобно плащане</li>
      </ul>
      <p>Всички онлайн плащания са защитени с SSL криптиране.</p>`
  },

  // Personalization
  {
    category: 'personalization',
    question: 'Какво име мога да избродирам?',
    answer: `<p>Можете да избродирате всяко име на кирилица или латиница:</p>
      <ul>
        <li><strong>Имена на деца:</strong> Мария, Георги, София, Александър и др.</li>
        <li><strong>Прякори:</strong> Мими, Гошо, Соси и др.</li>
        <li><strong>Думи:</strong> Принцеса, Супергерой, Малък шеф и др.</li>
      </ul>
      <p><strong>Ограничения:</strong></p>
      <ul>
        <li>Максимум 12 символа</li>
        <li>Само букви (без специални символи)</li>
        <li>Първа буква главна, останалите малки</li>
      </ul>
      <p>При въпроси относно конкретно име, свържете се с нас.</p>`
  },
  {
    category: 'personalization',
    question: 'Какви шрифтове и цветове на конец предлагате?',
    answer: `<p><strong>Налични шрифтове:</strong></p>
      <ul>
        <li>Класически - елегантен и четлив</li>
        <li>Детски - игрив и закръглен</li>
        <li>Ръкописен - естествен и топъл</li>
      </ul>
      <p><strong>Цветове на конеца:</strong></p>
      <p>Предлагаме над 20 цвята: розово, синьо, червено, златисто, сребърно, черно, бяло, зелено, лилаво и много други.</p>
      <p>Препоръчваме цвят, който контрастира с цвета на продукта за по-добра видимост.</p>`
  },
  {
    category: 'personalization',
    question: 'Мога ли да видя как ще изглежда бродерията преди поръчка?',
    answer: `<p>В момента не предлагаме автоматичен визуализатор, но можете:</p>
      <ol>
        <li>Да разгледате примерните снимки на всеки продукт</li>
        <li>Да ни пишете на <a href="mailto:info@emwear.bg">info@emwear.bg</a> с вашето име и предпочитания</li>
        <li>Ще ви изпратим примерна визуализация преди изработка (при поискване)</li>
      </ol>
      <p>Всички наши продукти са снимани с реални бродерии, така че можете да видите качеството на изработката.</p>`
  },
  {
    category: 'personalization',
    question: 'Какво е машинна бродерия и защо е качествена?',
    answer: `<p><strong>Машинна бродерия</strong> е процес, при който специализирана машина избродира името с висока прецизност.</p>
      <p><strong>Предимства:</strong></p>
      <ul>
        <li><strong>Трайност:</strong> Бродерията издържа стотици пранета без да избледнява</li>
        <li><strong>Прецизност:</strong> Всяка буква е перфектно изработена</li>
        <li><strong>Качество:</strong> Използваме висококачествени конци, които не се разпускат</li>
        <li><strong>Професионален вид:</strong> Изглежда елегантно и луксозно</li>
      </ul>
      <p>За разлика от печат или апликация, бродерията е вградена в плата и е част от продукта.</p>`
  },

  // Delivery
  {
    category: 'delivery',
    question: 'Колко струва доставката?',
    answer: `<p><strong>Цени на доставка:</strong></p>
      <ul>
        <li><strong>Безплатна доставка</strong> при поръчки над €60</li>
        <li><strong>5.99 лв</strong> - Доставка до офис на Еконт/Спиди</li>
        <li><strong>7.99 лв</strong> - Доставка до адрес</li>
      </ul>
      <p><strong>Покритие:</strong> Доставяме до всички градове и села в България чрез Еконт и Спиди.</p>
      <p>Цената се изчислява автоматично при завършване на поръчката.</p>`
  },
  {
    category: 'delivery',
    question: 'До къде доставяте?',
    answer: `<p>Доставяме до <strong>всички градове и села в България</strong> чрез:</p>
      <ul>
        <li><strong>Еконт</strong> - Над 5000 офиса и автомата</li>
        <li><strong>Спиди</strong> - Над 1000 офиса</li>
      </ul>
      <p><strong>Опции за доставка:</strong></p>
      <ul>
        <li>До офис на куриера (най-евтино)</li>
        <li>До автомат (24/7 достъп)</li>
        <li>До адрес (най-удобно)</li>
      </ul>
      <p>Можете да изберете предпочитания офис или адрес при завършване на поръчката.</p>`
  },
  {
    category: 'delivery',
    question: 'Как мога да проследя поръчката си?',
    answer: `<p>След изпращане на поръчката ще получите:</p>
      <ol>
        <li><strong>Имейл с номер за проследяване</strong> (tracking number)</li>
        <li><strong>SMS от куриера</strong> с информация за доставката</li>
      </ol>
      <p><strong>Как да проследите:</strong></p>
      <ul>
        <li>Посетете сайта на <a href="https://www.econt.com" target="_blank" rel="noopener">Еконт</a> или <a href="https://www.speedy.bg" target="_blank" rel="noopener">Спиди</a></li>
        <li>Въведете номера за проследяване</li>
        <li>Вижте текущото местоположение на пратката</li>
      </ul>
      <p>Можете също да проверите статуса в профила си на сайта в секция "Моите поръчки".</p>`
  },

  // Returns
  {
    category: 'returns',
    question: 'Мога ли да върна или обменя продукт?',
    answer: `<p><strong>Важно:</strong> Тъй като всички продукти са персонализирани специално за вас, <strong>връщане и обмяна не са възможни</strong>, освен в следните случаи:</p>
      <ul>
        <li><strong>Дефект на продукта</strong> - производствен брак</li>
        <li><strong>Грешка при изработка</strong> - неправилно име или цвят</li>
        <li><strong>Повреда при доставка</strong> - видими щети на опаковката</li>
      </ul>
      <p><strong>Процедура при рекламация:</strong></p>
      <ol>
        <li>Свържете се с нас в рамките на 14 дни от получаване</li>
        <li>Изпратете снимки на проблема</li>
        <li>Ще ви изпратим нов продукт безплатно или ще възстановим сумата</li>
      </ol>
      <p>Моля, проверявайте внимателно името и детайлите преди потвърждаване на поръчката.</p>`
  },
  {
    category: 'returns',
    question: 'Какво да направя ако получа дефектен продукт?',
    answer: `<p>Ако получите продукт с дефект, следвайте тези стъпки:</p>
      <ol>
        <li><strong>Не приемайте пратката</strong> ако опаковката е видимо повредена</li>
        <li><strong>Направете снимки</strong> на дефекта веднага след разопаковане</li>
        <li><strong>Свържете се с нас</strong> на <a href="mailto:info@emwear.bg">info@emwear.bg</a> или <a href="tel:+359894366008">+359 894 366 008</a></li>
        <li><strong>Изпратете снимките</strong> и номера на поръчката</li>
      </ol>
      <p><strong>Ние ще:</strong></p>
      <ul>
        <li>Прегледаме случая в рамките на 24 часа</li>
        <li>Изпратим нов продукт безплатно</li>
        <li>Или възстановим пълната сума</li>
      </ul>
      <p>Вашето удовлетворение е наш приоритет!</p>`
  },

  // Quality
  {
    category: 'quality',
    question: 'От какви материали са направени продуктите?',
    answer: `<p>Използваме само <strong>висококачествени материали</strong>:</p>
      <p><strong>Халати:</strong></p>
      <ul>
        <li>100% памучен велур (махрово платно)</li>
        <li>Плътност: 350-400 г/м²</li>
        <li>Мек, абсорбиращ и дълготраен</li>
      </ul>
      <p><strong>Раници и чанти:</strong></p>
      <ul>
        <li>Висококачествен полиестер</li>
        <li>Водоустойчиво покритие</li>
        <li>Здрави ципове и шевове</li>
      </ul>
      <p><strong>Кърпи:</strong></p>
      <ul>
        <li>100% памук</li>
        <li>Плътност: 400-500 г/м²</li>
        <li>Мека и абсорбираща текстура</li>
      </ul>
      <p>Всички материали са безопасни за деца и сертифицирани.</p>`
  },
  {
    category: 'quality',
    question: 'Как да се грижа за продукта с бродерия?',
    answer: `<p><strong>Препоръки за пране:</strong></p>
      <ul>
        <li>Перете на <strong>30-40°C</strong></li>
        <li>Използвайте <strong>деликатна програма</strong></li>
        <li>Избягвайте <strong>белина и агресивни препарати</strong></li>
        <li>Обърнете продукта <strong>наопаки</strong> преди пране</li>
      </ul>
      <p><strong>Сушене:</strong></p>
      <ul>
        <li>Сушете на <strong>въздух</strong> или на <strong>ниска температура</strong> в сушилня</li>
        <li>Избягвайте директна слънчева светлина за дълго време</li>
      </ul>
      <p><strong>Гладене:</strong></p>
      <ul>
        <li>Гладете от <strong>обратната страна</strong> на бродерията</li>
        <li>Използвайте <strong>средна температура</strong></li>
      </ul>
      <p>При правилна грижа продуктът ще запази качеството си години наред!</p>`
  },
  {
    category: 'quality',
    question: 'Издържа ли бродерията на многократно пране?',
    answer: `<p><strong>Да, абсолютно!</strong> Машинната бродерия е изключително трайна.</p>
      <p><strong>Защо е трайна:</strong></p>
      <ul>
        <li>Използваме <strong>висококачествени полиестерни конци</strong></li>
        <li>Конците са <strong>устойчиви на избледняване</strong></li>
        <li>Бродерията е <strong>вградена в плата</strong>, не е залепена</li>
        <li>Издържа <strong>стотици пранета</strong> без промяна</li>
      </ul>
      <p><strong>Тестове:</strong></p>
      <p>Нашите продукти са тествани при над 100 пранета на 40°C без видима промяна в качеството на бродерията.</p>
      <p>Ако спазвате препоръките за грижа, бродерията ще изглежда като нова дълги години.</p>`
  },
  {
    category: 'quality',
    question: 'Безопасни ли са продуктите за бебета и малки деца?',
    answer: `<p><strong>Да, всички наши продукти са 100% безопасни за деца!</strong></p>
      <p><strong>Сертификати и стандарти:</strong></p>
      <ul>
        <li>Материалите са <strong>сертифицирани по OEKO-TEX Standard 100</strong></li>
        <li>Не съдържат <strong>вредни химикали</strong></li>
        <li>Конците са <strong>хипоалергенни</strong></li>
        <li>Няма <strong>малки части</strong>, които могат да се отделят</li>
      </ul>
      <p><strong>Подходящи за:</strong></p>
      <ul>
        <li>Бебета от 0+ месеца</li>
        <li>Деца с чувствителна кожа</li>
        <li>Алергични деца</li>
      </ul>
      <p>Всички продукти са тествани и одобрени за детска употреба.</p>`
  },
];

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') {
    return faqs;
  }
  return faqs.filter(faq => faq.category === activeCategory.value);
});

const toggleItem = (index: number) => {
  const idx = openItems.value.indexOf(index);
  if (idx > -1) {
    openItems.value.splice(idx, 1);
  } else {
    openItems.value.push(index);
  }
};

// FAQ Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.replace(/<[^>]*>/g, ''), // Strip HTML for schema
          },
        })),
      }),
    },
  ],
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/breakpoints" as *;
@use "~/assets/styles/fonts" as *;

.faq-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 2rem 0 4rem;

  @include up(md) {
    padding: 3rem 0 5rem;
  }

  &__container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;

    @include up(md) {
      padding: 0 2rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 3rem;

    @include up(md) {
      margin-bottom: 4rem;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: $brand-ink;
    margin: 0 0 1rem;
  }

  &__subtitle {
    font-size: 1.125rem;
    color: $text-secondary;
    margin: 0;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
    justify-content: center;
  }

  &__category-btn {
    padding: 0.625rem 1.25rem;
    border: 2px solid rgba($brand, 0.2);
    background: white;
    color: $brand-ink;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: $brand;
      background: rgba($brand, 0.05);
    }

    &--active {
      background: $brand;
      color: white;
      border-color: $brand;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__item {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }

  &__question {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    background: white;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s ease;

    &:hover {
      background: rgba($brand, 0.02);
    }

    &--open {
      .faq-page__icon {
        transform: rotate(180deg);
      }
    }
  }

  &__question-text {
    font-family: $font-heading;
    font-size: 1.125rem;
    font-weight: 600;
    color: $brand-ink;
    margin: 0;
    padding-right: 1rem;
    line-height: 1.4;

    @include up(md) {
      font-size: 1.25rem;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: $brand;
    transition: transform 0.3s ease;
  }

  &__answer {
    padding: 0 1.5rem 1.5rem;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__answer-text {
    color: $text-secondary;
    line-height: 1.7;
    font-size: 1rem;

    :deep(p) {
      margin: 0 0 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(ul),
    :deep(ol) {
      margin: 0.5rem 0 1rem 1.5rem;
      padding: 0;

      li {
        margin-bottom: 0.5rem;
      }
    }

    :deep(strong) {
      color: $brand-ink;
      font-weight: 600;
    }

    :deep(a) {
      color: $brand;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__cta {
    margin-top: 4rem;
    padding: 2.5rem;
    background: linear-gradient(135deg, $brand 0%, darken($brand, 10%) 100%);
    border-radius: 16px;
    text-align: center;
    color: white;
  }

  &__cta-title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
  }

  &__cta-text {
    font-size: 1.125rem;
    margin: 0 0 1.5rem;
    opacity: 0.95;
  }

  &__cta-button {
    display: inline-block;
    padding: 0.875rem 2rem;
    background: white;
    color: $brand;
    border-radius: 50px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
