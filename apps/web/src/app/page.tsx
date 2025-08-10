import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <section>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Керуйте партнерами та трафіком <br /> в одному місці
        </h1>
        <p className="mt-4 text-gray-600">
          CRM для affiliate-менеджерів із вбудованим трекером кліків та конверсій.
          Аналітика в реальному часі, виплати, чат і автоматика.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/auth/signup" className="px-5 py-3 rounded-xl bg-black text-white">
            Спробувати безкоштовно
          </Link>
          <a href="#how" className="px-5 py-3 rounded-xl border border-gray-300">
            Дивитись як працює
          </a>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Єдина база", "Інтегрований трекер", "Аналіз у реальному часі"].map((t) => (
            <div key={t} className="p-4 rounded-2xl border">
              <div className="font-medium">{t}</div>
              <div className="text-sm text-gray-600 mt-1">Affilion робить це з коробки.</div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border p-6">
        <div className="text-sm text-gray-500">Прев’ю дашборду</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="text-xs text-gray-500">Кліки</div>
            <div className="text-2xl font-semibold">12,450</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="text-xs text-gray-500">Конверсії</div>
            <div className="text-2xl font-semibold">784</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="text-xs text-gray-500">CR</div>
            <div className="text-2xl font-semibold">6.3%</div>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-600">
          Алерти якості, виплати, чат із вебами — у єдиному вікні.
        </div>
      </aside>

      <section id="how" className="col-span-1 md:col-span-2 mt-8">
        <h2 className="text-2xl font-semibold">Як це працює</h2>
        <ol className="mt-3 list-decimal list-inside text-gray-700 space-y-1">
          <li>Створюєте партнера у CRM → генерується publisher_id.</li>
          <li>Створюєте оффер → система видає трек-лінк.</li>
          <li>Клік → редирект → постбек → аналітика в реальному часі.</li>
          <li>Виплати, бонуси, алерти — без перемикань між сервісами.</li>
        </ol>
      </section>
    </div>
  );
}
