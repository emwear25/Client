<template>
  <div class="terms-page">
    <div class="container">
      <h1 class="terms-page__title">Общи Условия</h1>
      <p class="terms-page__last-updated">Последна актуализация: {{ lastUpdated }}</p>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">1. Въведение</h2>
        <p>
          Настоящите Общи Условия регулират използването на уебсайта
          <strong>emwear.bg</strong> и поръчването на продукти от
          <strong>Хас 93 ЕООД</strong> ("ние", "нас", "нашата компания").
        </p>
        <p>
          Като използвате нашия уебсайт или правите поръчка, вие се съгласявате с настоящите Общи
          Условия. Ако не се съгласявате, моля не използвайте нашия уебсайт.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">2. Информация за Компанията</h2>
        <div class="terms-page__company-info">
          <p><strong>Търговско име:</strong> Хас 93 ЕООД</p>
          <p><strong>ЕИК:</strong> 207849969</p>
          <p><strong>Адрес:</strong> гр. Варна, Арх. Георги Ганев 37, мол Хасан Хасанов</p>
          <p>
            <strong>Имейл:</strong>
            <a href="mailto:info@emwear.bg" class="terms-page__link">info@emwear.bg</a>
          </p>
          <p>
            <strong>Телефон:</strong>
            <a href="tel:+359890927520" class="terms-page__link">+359 89 092 7520</a>
          </p>
        </div>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">3. Продукти и Цени</h2>
        <h3 class="terms-page__subsection-title">3.1. Описание на Продуктите</h3>
        <p>
          Стремим се да предоставим точна информация за продуктите, включително описания, снимки и
          цени. Въпреки това, запазваме си правото да коригираме грешки и да актуализираме
          информацията по всяко време.
        </p>

        <h3 class="terms-page__subsection-title">3.2. Цени</h3>
        <ul>
          <li>Всички цени са в лева (BGN) и включват ДДС</li>
          <li>Цените могат да се променят без предварително уведомяване</li>
          <li>Цената на поръчката е тази, която е валидна в момента на потвърждение</li>
          <li>При промоции и намаления, валидната цена е тази, показана в кошницата</li>
        </ul>

        <h3 class="terms-page__subsection-title">3.3. Наличност</h3>
        <p>
          Наличността на продуктите е показана в реално време. В случай че продуктът не е наличен
          след направена поръчка, ще ви уведомим и ще предложим алтернатива или пълно възстановяване
          на сумата.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">4. Поръчки</h2>
        <h3 class="terms-page__subsection-title">4.1. Процес на Поръчка</h3>
        <ol>
          <li>Избор на продукти и добавяне в кошницата</li>
          <li>Попълване на данни за доставка и плащане</li>
          <li>Проверка и потвърждение на поръчката</li>
          <li>Получаване на потвърждение по имейл</li>
        </ol>

        <h3 class="terms-page__subsection-title">4.2. Потвърждение на Поръчка</h3>
        <p>
          Поръчката се счита за приета след получаване на имейл потвърждение. До този момент
          запазваме си правото да откажем поръчката в случай на технически проблеми, липса на
          наличност или подозрителна активност.
        </p>

        <h3 class="terms-page__subsection-title">4.3. Грешни Данни</h3>
        <p>
          Отговорността за правилността на предоставените данни (адрес, телефон, имейл) е на
          клиента. В случай на грешни данни, които водят до невъзможност за доставка, клиентът носи
          отговорност за допълнителните разходи.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">5. Плащане</h2>
        <h3 class="terms-page__subsection-title">5.1. Методи на Плащане</h3>
        <ul>
          <li>Наложен платеж (при доставка)</li>
          <li>Банков превод (при поръчки над определена сума)</li>
          <li>Онлайн плащане с карта (при приложимо)</li>
        </ul>

        <h3 class="terms-page__subsection-title">5.2. Плащане при Доставка</h3>
        <p>
          При плащане с наложен платеж, сумата се заплаща на куриера при получаване на пратката. При
          отказ от получаване, клиентът носи отговорност за разходите по доставката.
        </p>

        <h3 class="terms-page__subsection-title">5.3. Забавяне на Плащане</h3>
        <p>
          В случай на забавяне на плащането, запазваме си правото да отменим поръчката и да поискаме
          обезщетение за причинените разходи.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">6. Доставка</h2>
        <h3 class="terms-page__subsection-title">6.1. Методи на Доставка</h3>
        <ul>
          <li>Доставка до офис на куриер (Еконт или Спиди)</li>
          <li>Доставка до адрес (до врата)</li>
          <li>Доставка до автомати на Еконт</li>
        </ul>

        <h3 class="terms-page__subsection-title">6.2. Срокове за Доставка</h3>
        <ul>
          <li>Срок за доставка: <strong>1-3 работни дни</strong> след потвърждение на поръчката</li>
          <li>Сроковете са приблизителни и могат да се променят в зависимост от натоварването</li>
          <li>При персонализирани продукти, срокът може да бъде по-дълъг</li>
        </ul>

        <h3 class="terms-page__subsection-title">6.3. Разходи за Доставка</h3>
        <ul>
          <li>Безплатна доставка за поръчки над <strong>110 лв.</strong></li>
          <li>
            Цената за доставка се изчислява автоматично в зависимост от града, метода на доставка и
            теглото
          </li>
          <li>Точната цена се показва в процеса на поръчка</li>
        </ul>

        <h3 class="terms-page__subsection-title">6.4. Риск и Собственост</h3>
        <p>
          Рискът от загуба или повреда на продуктите преминава към клиента при предаване на пратката
          на куриера или при получаване от клиента. Собствеността преминава при пълното плащане на
          поръчката.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">7. Връщане и Рекламации</h2>
        <h3 class="terms-page__subsection-title">7.1. Неперсонализирани Продукти</h3>
        <p>
          Можете да върнете неперсонализиран продукт в срок от <strong>14 дни</strong> от
          получаването, при условие че:
        </p>
        <ul>
          <li>Продуктът е в оригинална опаковка</li>
          <li>Неизползван и без следи от употреба</li>
          <li>Имате фактура или документ за покупка</li>
        </ul>
        <p>Разходите по връщането са за сметка на клиента.</p>

        <h3 class="terms-page__subsection-title">7.2. Персонализирани Продукти</h3>
        <p>
          Персонализираните продукти (с бродерия, име, персонализиран дизайн)
          <strong>не могат да бъдат върнати</strong>, освен ако:
        </p>
        <ul>
          <li>Продуктът е повреден или има производствен дефект</li>
          <li>Полученият продукт не съответства на поръчания (грешка от наша страна)</li>
        </ul>
        <p>В тези случаи ще заменим продукта или ще възстановим пълната сума.</p>

        <h3 class="terms-page__subsection-title">7.3. Процедура за Връщане</h3>
        <ol>
          <li>
            Свържете се с нас на
            <a href="mailto:info@emwear.bg" class="terms-page__link">info@emwear.bg</a> или телефон
            <a href="tel:+359890927520" class="terms-page__link">+359 89 092 7520</a>
          </li>
          <li>Опишете причината за връщането</li>
          <li>Изпратете снимки на продукта (при дефекти)</li>
          <li>Изпратете продукта на посочения адрес</li>
          <li>След проверка, ще възстановим сумата или заменим продукта</li>
        </ol>

        <h3 class="terms-page__subsection-title">7.4. Възстановяване на Сума</h3>
        <p>
          Възстановяването на сумата се извършва по същия начин, по който е направено плащането, в
          срок до 14 дни след получаване на върнатия продукт.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">8. Гаранции</h2>
        <h3 class="terms-page__subsection-title">8.1. Качество на Продуктите</h3>
        <p>
          Гарантираме, че всички продукти отговарят на описанието и са с добро качество. В случай на
          производствен дефект, ще заменим продукта или възстановим сумата.
        </p>

        <h3 class="terms-page__subsection-title">8.2. Персонализация</h3>
        <p>
          При персонализирани продукти, клиентът е отговорен за правилността на предоставената
          информация (име, текст за бродерия). В случай на грешка от страна на клиента, не носим
          отговорност.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">9. Интелектуална Собственост</h2>
        <p>
          Всички материали на уебсайта, включително текстове, снимки, логотипи и дизайн, са
          собственост на <strong>Хас 93 ЕООД</strong> или са използвани с разрешение. Забранено е
          копирането, разпространението или използването им без писмено разрешение.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">10. Отговорност</h2>
        <h3 class="terms-page__subsection-title">10.1. Ограничение на Отговорността</h3>
        <p>
          Нашата отговорност е ограничена до стойността на поръчаните продукти. Не носим отговорност
          за:
        </p>
        <ul>
          <li>Непряки, случайни или последващи щети</li>
          <li>Загуба на печалба или данни</li>
          <li>Забавяния в доставката, причинени от трети страни (куриери, природни бедствия)</li>
        </ul>

        <h3 class="terms-page__subsection-title">10.2. Сила Мажор</h3>
        <p>
          Не носим отговорност за неизпълнение на задълженията си в случай на обстоятелства извън
          нашия контрол (война, природни бедствия, стачки, технически проблеми).
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">11. Защита на Данните</h2>
        <p>
          Обработката на личните данни се извършва съгласно нашата
          <NuxtLink to="/privacy-policy" class="terms-page__link"
            >Политика за Поверителност</NuxtLink
          >
          и приложимото законодателство за защита на данните.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">12. Резолване на Спорове</h2>
        <h3 class="terms-page__subsection-title">12.1. Внесудебно Решаване</h3>
        <p>При възникване на спор, ще се стремим да го решим по взаимно съгласие чрез преговори.</p>

        <h3 class="terms-page__subsection-title">12.2. Приложимо Право</h3>
        <p>
          Настоящите Общи Условия се регулират от българското законодателство. Всички спорове се
          решават от компетентните български съдилища.
        </p>

        <h3 class="terms-page__subsection-title">12.3. Право на Внесудебно Решаване</h3>
        <p>
          Съгласно Закона за защита на потребителите, имате право да се обърнете към Комисията за
          защита на потребителите или да използвате платформата за онлайн разрешаване на спорове на
          Европейската комисия:
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            class="terms-page__link"
            >https://ec.europa.eu/consumers/odr</a
          >.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">13. Промени в Условията</h2>
        <p>
          Запазваме си правото да променяме настоящите Общи Условия по всяко време. Промените влизат
          в сила веднага след публикуването им на уебсайта. Препоръчваме да преглеждате тази
          страница периодично.
        </p>
      </section>

      <section class="terms-page__section">
        <h2 class="terms-page__section-title">14. Контакти</h2>
        <p>За въпроси относно настоящите Общи Условия, моля свържете се с нас:</p>
        <div class="terms-page__company-info">
          <p><strong>Хас 93 ЕООД</strong></p>
          <p>гр. Варна, Арх. Георги Ганев 37, мол Хасан Хасанов</p>
          <p>
            <strong>Имейл:</strong>
            <a href="mailto:info@emwear.bg" class="terms-page__link">info@emwear.bg</a>
          </p>
          <p>
            <strong>Телефон:</strong>
            <a href="tel:+359890927520" class="terms-page__link">+359 89 092 7520</a>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from "~/composables/useSEO";

const lastUpdated = "Януари 2025";

usePageSEO({
  title: "Общи Условия",
  description:
    "Общи условия за използване на emWear. Информация за поръчки, доставка, връщане и гаранции.",
  type: "website",
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/colors" as *;
@use "~/assets/styles/fonts" as *;
@use "~/assets/styles/breakpoints" as *;

.terms-page {
  min-height: 60vh;
  padding: 4rem 1rem;

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 4vw, 3rem);
    color: $brand-ink;
    margin: 0 0 1rem;
    text-align: center;
  }

  &__last-updated {
    font-family: $font-body;
    font-size: 0.875rem;
    color: $text-secondary;
    text-align: center;
    margin: 0 0 3rem;
  }

  &__section {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $brand-ink;
    margin: 0 0 1rem;
    font-weight: 600;
  }

  &__subsection-title {
    font-family: $font-heading;
    font-size: 1.25rem;
    color: $brand-ink;
    margin: 1.5rem 0 1rem;
    font-weight: 600;
  }

  &__company-info {
    background: rgba($brand, 0.05);
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;

    p {
      margin: 0.5rem 0;
      font-family: $font-body;
      font-size: 1rem;
      line-height: 1.6;
    }
  }

  &__link {
    color: $brand;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $brand-accent-1;
      text-decoration: underline;
    }
  }

  // Apply content styles to section content
  &__section {
    p {
      font-family: $font-body;
      font-size: 1rem;
      line-height: 1.7;
      color: $text-primary;
      margin: 0 0 1rem;
    }

    ul,
    ol {
      margin: 1rem 0;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
        font-family: $font-body;
        font-size: 1rem;
        line-height: 1.7;
        color: $text-primary;
      }
    }

    strong {
      color: $brand-ink;
      font-weight: 600;
    }
  }
}
</style>

