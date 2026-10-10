import React, { useState, useRef, useMemo, useEffect } from "react";
import { Shirt, RotateCw, Type, Image as ImageIcon, Trash2, ShoppingCart, Sparkles, Move } from "lucide-react";

// ---------- Каталог ----------
const GENDER = {
  женское: {
    label: "Женское",
    accent: "#e879a8",
    items: [
      { id: "tshirt-f", name: "Футболка", base: 1290 },
      { id: "longsleeve-f", name: "Лонгслив", base: 1690 },
      { id: "hoodie-f", name: "Худи", base: 2690 },
      { id: "sweatshirt-f", name: "Свитшот", base: 2390 },
    ],
  },
  мужское: {
    label: "Мужское",
    accent: "#5b9bd5",
    items: [
      { id: "tshirt-m", name: "Футболка", base: 1390 },
      { id: "longsleeve-m", name: "Лонгслив", base: 1790 },
      { id: "hoodie-m", name: "Худи", base: 2790 },
      { id: "polo-m", name: "Поло", base: 1990 },
    ],
  },
};

const FABRICS = [
  { id: "cotton", name: "Хлопок 100%", price: 0, roughness: 0.85 },
  { id: "footer", name: "Футер 3-нитка", price: 350, roughness: 0.9 },
  { id: "fleece", name: "Флис", price: 450, roughness: 1.0 },
  { id: "tricot", name: "Трикотаж", price: 200, roughness: 0.75 },
  { id: "eco", name: "Эко-кожа", price: 900, roughness: 0.35 },
];

const COLORS = [
  { id: "white", name: "Белый", hex: "#f3f4f6" },
  { id: "black", name: "Чёрный", hex: "#23262b" },
  { id: "grey", name: "Серый", hex: "#9aa0a8" },
  { id: "navy", name: "Тёмно-синий", hex: "#26334d" },
  { id: "beige", name: "Бежевый", hex: "#d8c3a5" },
  { id: "olive", name: "Олива", hex: "#6f7a52" },
  { id: "bordo", name: "Бордо", hex: "#6d2233" },
  { id: "mint", name: "Мята", hex: "#8fd0bd" },
];

const PRINT_POSITIONS = ["Спереди", "Сзади"];

// ---------- Мини-3D: SVG-модель одежды с вращением ----------
// Прототип использует SVG с эффектом 3D-вращения (perspective + rotateY),
// что имитирует 360°-просмотр без внешних библиотек.
function Garment3D({ garment, color, rotation, files, embSize }) {
  const back = rotation > 90 && rotation < 270;
  const w = 260,
    h = 320;

  const shape = {
    tshirt:
      "M60,70 L95,45 L120,60 L140,60 L165,45 L200,70 L185,120 L170,115 L175,290 L85,290 L90,115 L75,120 Z",
    longsleeve:
      "M60,70 L95,45 L120,60 L140,60 L165,45 L200,70 L175,125 L200,265 L170,275 L158,180 L175,290 L85,290 L102,180 L90,275 L60,265 L85,125 Z",
    hoodie:
      "M55,85 L90,50 L120,65 L140,65 L170,50 L205,85 L190,135 L172,130 L178,300 L82,300 L88,130 L70,135 Z",
    polo: "M60,70 L95,45 L120,60 L140,60 L165,45 L200,70 L185,120 L170,115 L175,290 L85,290 L90,115 L75,120 Z",
    sweatshirt:
      "M57,80 L92,47 L120,62 L140,62 L168,47 L203,80 L188,130 L170,125 L176,298 L84,298 L90,125 L72,130 Z",
  };
  const key = garment.id.split("-")[0];
  const path = shape[key] || shape.tshirt;

  // Худи/свитшот: капюшон / манжеты
  const isHood = key === "hoodie";

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ perspective: 1400 }}>
      <div
        className="relative transition-transform duration-100"
        style={{ transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d", width: w, height: h }}
      >
        {/* тень */}
        <svg viewBox="0 0 260 320" width={w} height={h} className="drop-shadow-2xl">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path d={path} fill={color.hex} stroke="#0002" strokeWidth="1.5" />
          <path d={path} fill="url(#g1)" />
          {isHood && (
            <path
              d="M95,55 Q130,95 165,55 Q150,40 130,42 Q110,40 95,55 Z"
              fill={color.hex}
              stroke="#0002"
              opacity="0.95"
            />
          )}
          {/* линия ворота / центральный шов сзади */}
          {back ? (
            <line x1="130" y1="60" x2="130" y2="290" stroke="#0002" strokeWidth="1" strokeDasharray="3 4" />
          ) : (
            <path d="M110,60 Q130,80 150,60" fill="none" stroke="#0003" strokeWidth="2" />
          )}
        </svg>

        {/* наклейка принта (имитация decal поверх модели) */}
        {files.map((f) => (
          <div
            key={f.id}
            className="pointer-events-none absolute"
            style={{
              left: `${f.xPct}%`,
              top: `${f.yPct}%`,
              width: `${f.sizePx}px`,
              transform: `translate(-50%,-50%) rotate(${f.rot}deg)`,
              opacity: back === f.back ? 1 : 0.15,
            }}
          >
            {f.text ? (
              <span
                className="whitespace-nowrap font-black tracking-tight"
                style={{ color: f.texColor, fontSize: `${f.sizePx * 0.22}px` }}
              >
                {f.text}
              </span>
            ) : (
              <img src={f.url} alt="" className="w-full rounded" />
            )}
          </div>
        ))}
      </div>

      {embSize > 0 && null}
    </div>
  );
}

// ---------- UI-хелперы ----------
function Panel({ title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">{title}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-white text-slate-900 shadow" : "bg-white/10 text-white/70 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

export default function ModellerPrototype() {
  const [screen, setScreen] = useState("home"); // home | list | editor
  const [gender, setGender] = useState(null);
  const [garment, setGarment] = useState(null);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [qty, setQty] = useState(1);
  const [embText, setEmbText] = useState("");
  const [embPrice, setEmbPrice] = useState(0);
  const [files, setFiles] = useState([]);
  const [side, setSide] = useState("Спереди");
  const [cart, setCart] = useState([]);

  const dragRef = useRef(null);
  const stageRef = useRef(null);

  // автоспин
  useEffect(() => {
    if (!spinning) return;
    const t = setInterval(() => setRotation((r) => (r + 4) % 360), 40);
    return () => clearInterval(t);
  }, [spinning]);

  // вышивка: цена = по количеству символов + базовая
  useEffect(() => {
    setEmbPrice(embText.trim() ? 290 + embText.trim().length * 45 : 0);
  }, [embText]);

  const printsPrice = useMemo(() => files.reduce((s, f) => s + f.price, 0), [files]);

  const total = useMemo(() => {
    if (!garment) return 0;
    const one = garment.base + fabric.price + embPrice + printsPrice;
    return one * qty;
  }, [garment, fabric, embPrice, printsPrice, qty]);

  // drag принта на модели
  function onStagePointerDown(e, fileId) {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = fileId;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }
  function onMove(e) {
    const id = dragRef.current;
    if (!id || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const xPct = Math.min(92, Math.max(8, ((e.clientX - r.left) / r.width) * 100));
    const yPct = Math.min(92, Math.max(8, ((e.clientY - r.top) / r.height) * 100));
    setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, xPct, yPct } : f)));
  }
  function onUp() {
    dragRef.current = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }

  function addPrint(kind) {
    const id = Math.random().toString(36).slice(2);
    if (kind === "text") {
      const text = prompt("Введите текст (макс. 14 символов):", "МОЙ БРЕНД");
      if (!text) return;
      setFiles((fs) => [
        ...fs,
        { id, text: text.slice(0, 14), xPct: 50, yPct: 40, sizePx: 140, rot: 0, price: 190, back: side === "Сзади", texColor: "#111111" },
      ]);
    } else {
      const url = prompt("Вставьте прямую ссылку на изображение (PNG):", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png");
      if (!url) return;
      setFiles((fs) => [
        ...fs,
        { id, url, xPct: 50, yPct: 40, sizePx: 120, rot: 0, price: 340, back: side === "Сзади" },
      ]);
    }
  }

  function addToCart() {
    if (!garment) return;
    setCart((c) => [
      ...c,
      {
        id: Math.random().toString(36).slice(2),
        name: `${gender === "женское" ? "Ж" : "М"} · ${garment.name}`,
        fabric: fabric.name,
        color: color.name,
        emb: embText || "—",
        prints: files.length,
        qty,
        sum: total,
      },
    ]);
    setQty(1);
    setEmbText("");
    setFiles([]);
    setScreen("list");
  }

  const accent = gender ? GENDER[gender].accent : "#e879a8";

  return (
    <div className="atelier-shell min-h-screen" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: accent }} />
          <span className="font-bold tracking-tight">Сам себе модельер</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm">
          <ShoppingCart size={15} />
          <span>{cart.length}</span>
          <span className="ml-1 text-white/50">позиций</span>
        </div>
      </header>

      {/* HOME */}
      {screen === "home" && (
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h1 className="mb-2 text-center text-4xl font-black tracking-tight">Кого одеваем?</h1>
          <p className="mb-12 text-center text-white/50">Выберите направление, чтобы перейти к моделям</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Object.entries(GENDER).map(([k, g]) => (
              <button
                key={k}
                onClick={() => {
                  setGender(k);
                  setScreen("list");
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 p-8 text-left transition hover:border-white/30"
                style={{ background: `radial-gradient(circle at 30% 20%, ${g.accent}33, transparent 60%)` }}
              >
                <Shirt size={120} className="mb-6 opacity-80 transition group-hover:scale-105" style={{ color: g.accent }} />
                <div className="text-2xl font-bold">{g.label}</div>
                <div className="text-sm text-white/50">{g.items.length} базовые модели</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LIST */}
      {screen === "list" && (
        <div className="mx-auto max-w-6xl px-5 py-10">
          <button onClick={() => setScreen("home")} className="mb-6 text-sm text-white/50 hover:text-white">
            ← назад
          </button>
          <h2 className="mb-6 text-3xl font-black">
            {GENDER[gender].label} · базовые модели
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {GENDER[gender].items.map((it) => (
              <button
                key={it.id}
                onClick={() => {
                  setGarment(it);
                  setColor(COLORS[0]);
                  setFabric(FABRICS[0]);
                  setFiles([]);
                  setEmbText("");
                  setRotation(0);
                  setScreen("editor");
                }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition hover:border-white/30 hover:bg-white/10"
              >
                <div className="mb-3 flex h-32 items-center justify-center">
                  <div className="transition group-hover:scale-110">
                    <Garment3D garment={it} color={{ hex: "#e9eaee" }} rotation={0} files={[]} embSize={0} />
                  </div>
                </div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-xs text-white/40">от {it.base} ₽</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EDITOR */}
      {screen === "editor" && garment && (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]">
          {/* СЦЕНА */}
          <div>
            <button onClick={() => setScreen("list")} className="mb-4 text-sm text-white/50 hover:text-white">
              ← к моделям
            </button>
            <div
              ref={stageRef}
              onPointerDown={() => setSide(side)}
              className="relative flex h-[440px] items-center justify-center overflow-hidden rounded-3xl border border-white/10"
              style={{ background: `radial-gradient(circle at 50% 40%, ${color.hex}22, #0b0d12 70%)` }}
            >
              <div onPointerDown={(e) => e.stopPropagation()}>
                <Garment3D garment={garment} color={color} rotation={rotation} files={files} embSize={embPrice} />
              </div>

              {/* перетаскиваемые принты — оверлей-слой для drag */}
              <div className="pointer-events-none absolute inset-0">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="pointer-events-auto absolute cursor-move"
                    style={{ left: `${f.xPct}%`, top: `${f.yPct}%`, transform: "translate(-50%,-50%)" }}
                    onPointerDown={(e) => onStagePointerDown(e, f.id)}
                  >
                    <div className="rounded-md border border-dashed border-white/50 bg-white/5 px-3 py-2 text-[10px] text-white/70 backdrop-blur">
                      <Move size={11} className="mb-1 inline" /> тяни меня
                    </div>
                  </div>
                ))}
              </div>

              {/* вращение */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-black/40 px-3 py-2 backdrop-blur">
                <button onClick={() => setSpinning((s) => !s)} className="rounded-lg p-2 hover:bg-white/10">
                  <RotateCw size={16} className={spinning ? "animate-spin" : ""} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(+e.target.value)}
                  className="w-48 accent-white"
                />
                <span className="w-10 text-right text-xs text-white/50">{rotation}°</span>
              </div>

              <div className="absolute right-4 top-4 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
                {rotation > 90 && rotation < 270 ? "Вид: Сзади" : "Вид: Спереди"}
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-white/40">
              Крутите мышью по шкале · тяните метку принта, чтобы поставить его в нужное место
            </p>
          </div>

          {/* ПАНЕЛИ */}
          <div className="space-y-3">
            <Panel title="Модель">
              <div className="text-lg font-bold">{garment.name}</div>
              <div className="text-sm text-white/50">от {garment.base} ₽</div>
            </Panel>

            <Panel title="Ткань">
              <div className="flex flex-wrap gap-2">
                {FABRICS.map((f) => (
                  <Chip key={f.id} active={fabric.id === f.id} onClick={() => setFabric(f)}>
                    {f.name} {f.price ? `+${f.price}₽` : ""}
                  </Chip>
                ))}
              </div>
            </Panel>

            <Panel title="Цвет">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c)}
                    title={c.name}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      color.id === c.id ? "scale-110 border-white" : "border-white/20"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Вышивка">
              <input
                value={embText}
                onChange={(e) => setEmbText(e.target.value)}
                placeholder="Текст вышивки (напр. логотип)"
                className="w-full rounded-lg bg-black/40 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-white/40"
              />
              <div className="mt-1 text-xs text-white/40">
                {embText.trim() ? `+${embPrice} ₽ · ${embText.trim().length} симв.` : "вышивка пока не выбрана"}
              </div>
            </Panel>

            <Panel title="Принт / надпись">
              <div className="mb-2 flex gap-2">
                {PRINT_POSITIONS.map((p) => (
                  <Chip key={p} active={side === p} onClick={() => setSide(p)}>
                    {p}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addPrint("image")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs hover:bg-white/20"
                >
                  <ImageIcon size={13} /> Загрузить принт (+340₽)
                </button>
                <button
                  onClick={() => addPrint("text")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs hover:bg-white/20"
                >
                  <Type size={13} /> Надпись (+190₽)
                </button>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 rounded-lg bg-black/30 p-2 text-xs">
                      <span className="flex-1 truncate">{f.text || "изображение"}</span>
                      <span className="text-white/40">{f.back ? "сзади" : "спереди"}</span>
                      <input
                        type="range"
                        min="40"
                        max="240"
                        value={f.sizePx}
                        onChange={(e) =>
                          setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, sizePx: +e.target.value } : x)))
                        }
                        className="w-16"
                      />
                      <button
                        onClick={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))}
                        className="text-white/50 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Калькулятор">
              <div className="space-y-1 text-sm">
                <Row k="База" v={garment.base} />
                <Row k="Ткань" v={fabric.price} />
                <Row k="Вышивка" v={embPrice} />
                <Row k="Принты" v={printsPrice} />
                <div className="my-2 h-px bg-white/10" />
                <Row k="За 1 шт" v={total / qty} bold />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-white/50">Количество</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-lg font-black">
                <span>Итого</span>
                <span style={{ color: accent }}>{total.toLocaleString("ru-RU")} ₽</span>
              </div>
              <button
                onClick={addToCart}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-slate-900 transition hover:opacity-90"
                style={{ background: accent }}
              >
                <ShoppingCart size={16} /> Добавить в корзину
              </button>
            </Panel>
          </div>
        </div>
      )}

      {/* CART */}
      {cart.length > 0 && screen !== "editor" && (
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <h3 className="mb-3 text-xl font-bold">Корзина</h3>
          <div className="space-y-2">
            {cart.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <span className="font-semibold">{c.name}</span>
                <span className="text-white/50">
                  {c.fabric} · {c.color} · вышивка: {c.emb} · принтов: {c.prints}
                </span>
                <span className="ml-auto">
                  {c.qty} × {(c.sum / c.qty).toLocaleString("ru-RU")} ₽ ={" "}
                  <b>{c.sum.toLocaleString("ru-RU")} ₽</b>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right text-2xl font-black">
            Итого: {cart.reduce((s, c) => s + c.sum, 0).toLocaleString("ru-RU")} ₽
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, bold }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : "text-white/70"}`}>
      <span>{k}</span>
      <span>{Math.round(v).toLocaleString("ru-RU")} ₽</span>
    </div>
  );
}