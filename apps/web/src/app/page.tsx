"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-slate-100 to-white" />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10 lg:py-14">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-800 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              CRM + Трекер в одному продукті
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-slate-900">
              Керуйте партнерами та трафіком{" "}
              <span className="text-indigo-600">в одному місці</span>
            </h1>

            <p className="mt-4 text-slate-700 text-lg">
              Єдина платформа для онбордингу партнерів, видачі лінків, трекінгу кліків і конверсій, аналітики, антифроду та виплат —
              без перемикань між сервісами. {/* з документів: «все в одному інтерфейсі (CRM + трекер)» */}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Спробувати безкоштовно
              </Link>
              <a
                href="#how"
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-200 transition-colors"
              >
                Дивитись як працює
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { k: "Єдина база", v: "Партнери, програми, оффери — разом" },
                { k: "Інтегрований трекер", v: "Кліки й конверсії в реальному часі" },
                { k: "Аналітика + A/B", v: "CR, EPC, спліти, алерти" },
              ].map((i) => (
                <div key={i.k} className="p-4 rounded-2xl border border-slate-300 bg-white">
                  <dt className="font-medium text-slate-900">{i.k}</dt>
                  <dd className="text-sm text-slate-600 mt-1">{i.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero Illustration */}
          <aside className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">Прев’ю дашборду</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatCard title="Кліки" value="12,450" />
              <StatCard title="Конверсії" value="784" />
              <StatCard title="CR" value="6.3%" />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <MiniChart title="CR по днях" />
              <MiniChart title="EPC по офферам" />
            </div>

            <p className="mt-6 text-sm text-slate-600">
              Алерти якості, виплати, чат із вебами — у єдиному вікні.
            </p>
          </aside>
        </section>

        {/* КОМУ ЦЕ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Для кого Affilion</h2>
          <p className="mt-2 text-slate-700">
            Admin, Manager та Affiliate мають різні права, доступи й панелі. {/* ролі/доступи */}
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RoleCard
              title="Admin"
              bullets={[
                "Глобальні налаштування, інтеграції, виплати",
                "Правила антифроду, політики білінгу",
                "Аудит змін, доступи та ролі",
              ]}
              tag="Повний контроль"
            />
            <RoleCard
              title="Manager"
              bullets={[
                "Онбординг партнерів, approve/deny",
                "Оффери, лінки, A/B та аналітика",
                "Черга Review, алерти, матеріали",
              ]}
              tag="Зріст трафіку та якості"
            />
            <RoleCard
              title="Affiliate"
              bullets={[
                "Каталог програм, заявки",
                "Персональні лінки та саби",
                "Статистика, баланс, виплати",
              ]}
              tag="Проста робота з офферами"
            />
          </div>
          <p className="sr-only">
            Ролі та доступи: Admin — платформа/фінанси/антифрод; Manager — програми/оффери/аналіз; Affiliate — власні
            лінки/статистика/виплати. 
          </p>
        </section>

        {/* ЯК ЦЕ ПРАЦЮЄ */}
        <section id="how" className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Як це працює — від заявки до виплати</h2>
          <ol className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "Онбординг партнера",
                desc:
                  "Реєстрація, заявки в програми, approve/deny менеджером, KYC за потреби. Генерується publisher_id.",
              },
              {
                step: "Запуск офферу та лінків",
                desc:
                  "Оффери + лінки з A/B сплітом і UTM-пресетами. Партнер отримує свій трек-лінк і починає лити трафік.",
              },
              {
                step: "Трекінг і антифрод",
                desc:
                  "Клік → редирект → постбек із конверсією. Антибот-фільтр, GEO/ASN, правила auto-review/reject.",
              },
              {
                step: "Аналітика та виплати",
                desc:
                  "Performance-звіти (Clicks, Conv, CR, EPC, Revenue), алерти CR/no-traffic/cap. Баланси та виплати.",
              },
            ].map((s, i) => (
              <li
                key={s.step}
                className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm"
              >
                <div className="text-xs text-indigo-700/80 mb-1">Крок {i + 1}</div>
                <div className="font-medium text-slate-900">{s.step}</div>
                <div className="text-sm text-slate-600 mt-1">{s.desc}</div>
              </li>
            ))}
          </ol>
        </section>

        {/* КЛЮЧОВІ МОЖЛИВОСТІ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Ключові можливості</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<IconLightning />}
              title="Єдиний продукт"
              desc="CRM + трекер без «склейки» з іншими тулзами. Менше інтеграцій — більше контролю."
            />
            <FeatureCard
              icon={<IconBeaker />}
              title="A/B у лінку"
              desc="Спліт-тести лендінгів і креативів прямо в системі, без сторонніх сервісів."
            />
            <FeatureCard
              icon={<IconShield />}
              title="Антифрод"
              desc="Евристики на вході, авто-review/auto-reject, whitelist/blacklist GEO/ASN/IP."
            />
            <FeatureCard
              icon={<IconBell />}
              title="Алерти і автоматизації"
              desc="CR drop, cap overflow, no-traffic, webhooks та розсилки партнерам."
            />
            <FeatureCard
              icon={<IconChart />}
              title="Аналітика в реальному часі"
              desc="Clicks/Conv/CR/EPC/Revenue/Approval% з фільтрами за GEO/оффером/джерелом."
            />
            <FeatureCard
              icon={<IconWallet />}
              title="Виплати"
              desc="Періоди/пороги, інвойси, інтеграції Payoneer/Stripe/Tipalti (етапно)."
            />
          </div>
        </section>

        {/* ПОРІВНЯННЯ ЗІ СТЕКОМ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Замість зв’язки «CRM + сторонній трекер»</h2>
          <div className="mt-4 rounded-3xl border border-slate-300 bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="text-slate-900 font-medium">Класичний стек</div>
                <ul className="mt-2 text-slate-600 text-sm space-y-1">
                  <li>Складні інтеграції та дублювання даних</li>
                  <li>Окремий білінг/виплати</li>
                  <li>Різні інтерфейси для менеджера та партнера</li>
                </ul>
              </div>
              <div className="p-6 bg-indigo-50/60">
                <div className="text-slate-900 font-medium">Affilion</div>
                <ul className="mt-2 text-slate-700 text-sm space-y-1">
                  <li>Єдиний інтерфейс: CRM + трекер</li>
                  <li>Лінки, A/B, антифрод, виплати — разом</li>
                  <li>Швидший онбординг і прозора аналітика</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Питання та відповіді</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Faq
              q="Чим Affilion відрізняється від PartnerStack + Voluum/Keitaro?"
              a="Ми поєднуємо CRM, трекінг, антифрод, аналітику та виплати в одному продукті. Менше інтеграцій — більше швидкості керування та прозорості для партнерів."
            />
            <Faq
              q="Чи є антифрод?"
              a="Так. Евристики на вході, whitelist/blacklist GEO/ASN/IP, авто-review/auto-reject та черга Review для менеджера."
            />
            <Faq
              q="Як працюють виплати?"
              a="Підтверджені конверсії формують payable-баланс; інвойси — за період або порогом. Підтримуємо експорт та інтеграції з платіжними сервісами."
            />
            <Faq
              q="Чи є A/B тестування?"
              a="Так, спліт лендінгів і креативів прямо у лінках, з аналітикою CR/EPC по кожному варіанту."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="rounded-3xl border border-slate-300 bg-gradient-to-br from-indigo-50 to-white p-8 flex items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Готові спробувати Affilion?</h3>
              <p className="text-slate-700 mt-1">
                Запустіть онбординг партнерів, лінки й аналітику вже сьогодні.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Спробувати безкоштовно
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============ Small components ============ */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MiniChart({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{title}</div>
      {/* Simple inline chart */}
      <svg viewBox="0 0 200 60" className="mt-3 w-full h-16">
        <polyline
          fill="none"
          stroke="#6366F1"
          strokeWidth="3"
          points="0,50 20,45 40,30 60,35 80,18 100,24 120,20 140,25 160,15 180,18 200,12"
        />
        <circle cx="200" cy="12" r="3" fill="#6366F1" />
      </svg>
    </div>
  );
}

function RoleCard({ title, bullets, tag }: { title: string; bullets: string[]; tag: string }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900">{title}</div>
        <span className="text-xs rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5">{tag}</span>
      </div>
      <ul className="mt-3 text-sm text-slate-700 space-y-1">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 grid place-items-center text-indigo-700">
          {icon}
        </div>
        <div className="font-medium text-slate-900">{title}</div>
      </div>
      <p className="mt-2 text-sm text-slate-700">{desc}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="font-medium text-slate-900">{q}</div>
      <p className="mt-1 text-sm text-slate-700">{a}</p>
    </div>
  );
}

/* Icons */
function IconLightning() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
    </svg>
  );
}
function IconBeaker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 2h12v2h-1v6.586l3.707 3.707A1 1 0 0 1 20.586 16H3.414a1 1 0 0 1-.707-1.707L6 10.586V4H5V2zM8 4v7.414l-2 2h12l-2-2V4H8z" fill="currentColor"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" fill="currentColor"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 19h16v2H2V3h2v16zm3-8h3v6H7v-6zm5-4h3v10h-3V7zm5 2h3v8h-3V9z" fill="currentColor"/>
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M21 7H3V5l12-3 6 5zM3 9h18v10H3V9zm12 3h4v4h-4v-4z" fill="currentColor"/>
    </svg>
  );
}
