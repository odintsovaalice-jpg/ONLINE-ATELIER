import { useState, useMemo } from "react";
import modelPlaceholder from "./model-placeholder.svg";
import { Shirt, Ruler, Scissors, Palette, Type, Sparkles, ShoppingCart, Minus, Plus, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// ДАННЫЕ: модели, ткани, расход, зоны декора
// В реальном проекте это приходит из API (модели — из вашей БД,
// ткани — от поставщиков, расход ткани — ваша таблица)
// ---------------------------------------------------------------------------

const MODELS = [
  {
    id: "dress-aurora",
    name: "Платье-миди «Аврора»",
    img: modelPlaceholder,
    labor: 4200,
    zones: ["Грудь", "Спина", "Рукав"],
    // расход ткани в метрах: ключ — размер
    fabricUsage: { XS: 1.6, S: 1.8, M: 2.0, L: 2.2, XL: 2.4, XXL: 2.7 },
  },
  {
    id: "shirt-classic",
    name: "Рубашка oversize «Классик»",
    img: modelPlaceholder,
    labor: 2600,
    zones: ["Грудь", "Спина", "Манжет"],
    fabricUsage: { XS: 1.4, S: 1.5, M: 1.6, L: 1.8, XL: 1.9, XXL: 2.1 },
  },
  {
    id: "hoodie-storm",
    name: "Худи «Шторм»",
    img: modelPlaceholder,
    labor: 3100,
    zones: ["Грудь", "Спина", "Рукав", "Карман"],
    fabricUsage: { XS: 1.7, S: 1.8, M: 2.0, L: 2.2, XL: 2.4, XXL: 2.6 },
  },
];

// Ткани в реальном проекте приходят от поставщика по API:
// { sku, name, color, pricePerMeter, stockMeters }
const FABRICS = [
  { sku: "LN-102", name: "Лён плотный", color: "Олива", pricePerMeter: 850, stockMeters: 42 },
  { sku: "CT-330", name: "Хлопок поплин", color: "Белый", pricePerMeter: 640, stockMeters: 120 },
  { sku: "WL-210", name: "Шерсть костюмная", color: "Графит", pricePerMeter: 1900, stockMeters: 18 },
  { sku: "JS-044", name: "Джерси футер", color: "Индиго", pricePerMeter: 720, stockMeters: 75 },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Типы кастомизации и их цена
const DECOR_TYPES = [
  { id: "print", label: "Принт", icon: Palette, basePrice: 900 },
  { id: "embroidery", label: "Вышивка", icon: Sparkles, basePrice: 1300 },
  { id: "text", label: "Печатные буквы", icon: Type, basePrice: 500 },
];

const WORK_PRINT_ZONES = ["Грудь", "Спина", "Рукав", "Карман", "Манжет"];

export default function AtelierConstructor() {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [fabricSku, setFabricSku] = useState(FABRICS[0].sku);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  // кастомизация: массив декора, который добавил клиент
  const [decors, setDecors] = useState([]);
  const [draftType, setDraftType] = useState("print");
  const [draftZone, setDraftZone] = useState("Грудь");
  const [draftText, setDraftText] = useState("");
  const [draftPreview, setDraftPreview] = useState(false);

  const model = MODELS.find((m) => m.id === modelId);
  const fabric = FABRICS.find((f) => f.sku === fabricSku);

  // -----------------------------------------------------------------------
  // ГЛАВНЫЙ РАСЧЁТ — всё считается на лету, как в настоящем магазине
  // -----------------------------------------------------------------------
  const calc = useMemo(() => {
    const usagePerItem = model.fabricUsage[size] || 0;
    const totalUsage = +(usagePerItem * qty).toFixed(2);
    const fabricCost = Math.round(totalUsage * fabric.pricePerMeter);
    const laborCost = model.labor * qty;
    const decorCost = decors.reduce((s, d) => s + d.price, 0) * qty;
    const total = fabricCost + laborCost + decorCost;
    const enoughStock = fabric.stockMeters >= totalUsage;

    return { usagePerItem, totalUsage, fabricCost, laborCost, decorCost, total, enoughStock };
  }, [model, fabric, size, qty, decors]);

  function addDecor() {
    const type = DECOR_TYPES.find((t) => t.id === draftType);

    // принт/вышивка могут быть "с предпросмотром" — тогда +300 ₽ за макет
    let price = type.basePrice;
    if (draftPreview && (draftType === "print" || draftType === "embroidery")) price += 300;
    if (draftType === "text") price += Math.max(0, draftText.trim().length - 8) * 30; // длинный текст дороже

    const label =
      draftType === "text"
        ? `Буквы: «${draftText || "—"}»`
        : `${type.label}${draftPreview ? " (с макетом)" : ""}`;

    setDecors((prev) => [
      ...prev,
      { id: Date.now(), type: draftType, zone: draftZone, label, price },
    ]);
    setDraftText("");
    setDraftPreview(false);
  }

  function removeDecor(id) {
    setDecors((prev) => prev.filter((d) => d.id !== id));
  }

  const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";

  const stepDone1 = !!model;
  const stepDone2 = !!fabric;
  const stepDone3 = !!size;

  return (
    <div className="min-h-screen atelier-shell min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <Shirt className="text-stone-800" size={34} />
            <h1 className="text-2xl md:text-3xl font-bold">Онлайн-ателье · Конструктор</h1>
          </div>
          <p className="text-slate-500 mt-1">
            Соберите изделие по шагам — цена и расход ткани считаются автоматически
          </p>
        </header>

        {/* Прогресс-шаги */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Step n={1} label="Модель" done={stepDone1} />
          <Step n={2} label="Ткань" done={stepDone2} />
          <Step n={3} label="Размер" done={stepDone3} />
          <Step n={4} label="Декор" />
          <Step n={5} label="Заказ" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ЛЕВАЯ КОЛОНКА — выбор */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Модель */}
            <Section icon={Shirt} title="1. Выберите модель">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelId(m.id)}
                    className={
                      "text-left rounded-xl border-2 p-2 transition " +
                      (m.id === modelId
                        ? "border-stone-800 bg-stone-100"
                        : "border-slate-200 hover:border-stone-400 bg-white")
                    }
                  >
                    <img src={m.img} alt={m.name} className="w-full rounded-lg mb-2" />
                    <div className="font-medium text-sm leading-tight">{m.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Пошив от {fmt(m.labor)}</div>
                  </button>
                ))}
              </div>
            </Section>

            {/* 2. Ткань */}
            <Section icon={Palette} title="2. Выберите ткань (от поставщиков)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FABRICS.map((f) => {
                  const active = f.sku === fabricSku;
                  return (
                    <button
                      key={f.sku}
                      onClick={() => setFabricSku(f.sku)}
                      className={
                        "text-left rounded-xl border-2 p-3 transition " +
                        (active
                          ? "border-stone-800 bg-stone-100"
                          : "border-slate-200 hover:border-stone-400 bg-white")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{f.name}</span>
                        <span className="text-xs text-slate-400">{f.sku}</span>
                      </div>
                      <div className="text-sm text-slate-500">Цвет: {f.color}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-stone-800 font-semibold">{fmt(f.pricePerMeter)}/м</span>
                        <span className="text-xs text-slate-400">наличие: {f.stockMeters} м</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Данные о тканях и ценах подтягиваются от поставщика по API в реальном времени.
              </p>
            </Section>

            {/* 3. Размер и количество */}
            <Section icon={Ruler} title="3. Размер и количество">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Размер</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={
                          "px-4 py-2 rounded-lg border text-sm font-medium transition " +
                          (s === size
                            ? "bg-stone-900 text-white border-indigo-600"
                            : "bg-white border-slate-200 hover:border-stone-400")
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Позже сюда добавим снятие мерок по фото → авторазмер.
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-500 block mb-1">Количество</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center hover:bg-slate-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center hover:bg-slate-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            {/* 4. Кастомизация */}
            <Section icon={Sparkles} title="4. Добавьте декор (принт / вышивка / буквы)">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {DECOR_TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = t.id === draftType;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDraftType(t.id)}
                      className={
                        "flex items-center gap-2 rounded-lg border-2 p-3 text-sm transition " +
                        (active
                          ? "border-stone-800 bg-stone-100"
                          : "border-slate-200 hover:border-stone-400 bg-white")
                      }
                    >
                      <Icon size={18} className={active ? "text-stone-800" : "text-slate-400"} />
                      <span className="font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 items-end mb-3">
                <div>
                  <label className="text-sm text-slate-500 block mb-1">Зона на изделии</label>
                  <select
                    value={draftZone}
                    onChange={(e) => setDraftZone(e.target.value)}
                    className="border rounded-lg px-3 py-2 bg-white text-sm"
                  >
                    {WORK_PRINT_ZONES.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>

                {draftType === "text" && (
                  <div>
                    <label className="text-sm text-slate-500 block mb-1">Текст</label>
                    <input
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      placeholder="НАПРИМЕР: MOTHER"
                      className="border rounded-lg px-3 py-2 text-sm w-48"
                    />
                  </div>
                )}

                {(draftType === "print" || draftType === "embroidery") && (
                  <label className="flex items-center gap-2 text-sm bg-white border rounded-lg px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftPreview}
                      onChange={(e) => setDraftPreview(e.target.checked)}
                    />
                    Загрузить свой файл / сгенерировать ИИ (+300 ₽)
                  </label>
                )}

                <button
                  onClick={addDecor}
                  className="bg-stone-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-stone-700 transition"
                >
                  Добавить декор
                </button>
              </div>

              {decors.length > 0 && (
                <div className="space-y-2">
                  {decors.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between bg-white border rounded-lg px-3 py-2 text-sm"
                    >
                      <span>
                        <span className="font-medium">{d.label}</span>
                        <span className="text-slate-400"> · зона: {d.zone}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-stone-800 font-semibold">{fmt(d.price)}</span>
                        <button
                          onClick={() => removeDecor(d.id)}
                          className="text-slate-400 hover:text-red-500 text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* ПРАВАЯ КОЛОНКА — итог */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border shadow-sm p-5 sticky top-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <ShoppingCart size={20} className="text-stone-800" /> Ваше изделие
              </h3>

              <img src={model.img} alt="" className="w-full rounded-xl mb-4" />

              <Row label="Модель" value={model.name} />
              <Row label="Ткань" value={`${fabric.name}, ${fabric.color}`} />
              <Row label="Размер / Кол-во" value={`${size} · ${qty} шт`} />

              <div className="border-t my-3" />

              <Row
                label={`Ткань (${calc.totalUsage} м × ${fmt(fabric.pricePerMeter)})`}
                value={fmt(calc.fabricCost)}
              />
              <Row label={`Расход на 1 изделие`} value={`${calc.usagePerItem} м`} muted />
              <Row label="Пошив" value={fmt(calc.laborCost)} />
              {calc.decorCost > 0 && <Row label="Декор" value={fmt(calc.decorCost)} />}

              {!calc.enoughStock && (
                <div className="mt-2 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg p-2">
                  На складе поставщика не хватает ткани под этот заказ ({calc.totalUsage} м нужно,{" "}
                  {fabric.stockMeters} м есть). Нужен добор или другая ткань.
                </div>
              )}

              <div className="border-t my-3" />
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Итого</span>
                <span className="text-stone-800">{fmt(calc.total)}</span>
              </div>

              <button className="w-full mt-4 bg-stone-900 text-white rounded-xl py-3 font-semibold hover:bg-stone-700 transition">
                В корзину и оформить
              </button>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Прототип. Цены, ткани и расчёт — демонстрационные.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Мелкие компоненты
// ---------------------------------------------------------------------------
function Step({ n, label, done }) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border " +
        (done ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-500")
      }
    >
      <span
        className={
          "w-5 h-5 rounded-full flex items-center justify-center text-xs " +
          (done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600")
        }
      >
        {done ? <Check size={12} /> : n}
      </span>
      {label}
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Icon size={20} className="text-stone-800" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1 text-sm">
      <span className={muted ? "text-slate-400" : "text-slate-600"}>{label}</span>
      <span className={"text-right " + (muted ? "text-slate-400" : "font-medium")}>{value}</span>
    </div>
  );
}
