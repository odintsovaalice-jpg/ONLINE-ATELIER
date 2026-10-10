import React,{useMemo,useState} from 'react'
import {ArrowDownToLine,Check,CircleHelp,RotateCcw,ShoppingBag,Sparkles,X} from 'lucide-react'
import Scene from './Scene.jsx'
import {categories,products,fabrics,colors,decorations,placements} from './catalog.js'

export default function App(){
 const [category,setCategory]=useState('dresses'),[productId,setProductId]=useState('slip-dress')
 const [fabricId,setFabricId]=useState('silk'),[color,setColor]=useState('#c6b49d')
 const [decoration,setDecoration]=useState('none'),[placement,setPlacement]=useState('chest')
 const [onMannequin,setOnMannequin]=useState(false),[activeTab,setActiveTab]=useState('fabric'),[notice,setNotice]=useState('')
 const product=useMemo(()=>products[category].find(p=>p.id===productId)||products[category][0],[category,productId])
 const fabric=fabrics.find(f=>f.id===fabricId)||fabrics[0]
 function changeCategory(id){setCategory(id);setProductId(products[id][0].id);setDecoration('none')}
 function flash(msg){setNotice(msg);setTimeout(()=>setNotice(''),2500)}
 function reset(){setFabricId('silk');setColor('#c6b49d');setDecoration('none');setPlacement('chest');setOnMannequin(false);flash('Настройки сброшены')}
 function save(){
  const data={product:{category,...product},fabric:{...fabric,selectedColor:color},decoration:decorations.find(d=>d.id===decoration),placement:placements.find(p=>p.id===placement),preview:onMannequin?'mannequin':'product',createdAt:new Date().toISOString(),note:'Демонстрационная процедурная 3D-модель; не является производственной выкройкой.'}
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
  const a=document.createElement('a');a.href=url;a.download=`atelier-${product.id}.json`;a.click();URL.revokeObjectURL(url);flash('Конфигурация сохранена в JSON')
 }
 return <div className="app-shell">
  <header className="topbar"><a className="brand" href="#"><span className="brand-mark">A</span><span><strong>ATELIER</strong><small>MADE FOR YOU</small></span></a><nav className="top-nav"><span>Конструктор</span><span>Коллекции</span><span>Как это работает</span></nav><button className="header-action" onClick={save}><ShoppingBag size={16}/> Мой образ</button></header>
  <main className="workspace">
   <aside className="sidebar"><div className="eyebrow">ИНДИВИДУАЛЬНЫЙ ДИЗАЙН</div><h1>Создайте<br/><em>своё</em> изделие</h1><p className="intro">Сочетайте силуэты, материалы и детали. Ваш дизайн меняется прямо на глазах.</p>
    <section className="step-section"><div className="section-heading"><span className="step-number">01</span><h2>Категория</h2></div><div className="category-list">{categories.map(c=><button key={c.id} className={`category-item ${category===c.id?'selected':''}`} onClick={()=>changeCategory(c.id)}><span className="category-symbol">{c.icon}</span><span>{c.label}</span><span className="category-arrow">↗</span></button>)}</div></section>
    <section className="step-section"><div className="section-heading"><span className="step-number">02</span><h2>Модель</h2></div><div className="product-options">{products[category].map(p=><button key={p.id} className={`product-option ${productId===p.id?'selected':''}`} onClick={()=>setProductId(p.id)}><span className="product-dot">{productId===p.id?<Check size={13}/>:null}</span><span><strong>{p.name}</strong><small>{p.subtitle}</small></span></button>)}</div></section>
    <div className="sidebar-foot"><Sparkles size={14}/> Индивидуальность в каждой детали</div>
   </aside>
   <section className="preview-area"><div className="preview-topline"><div><span className="eyebrow">ВАШ ДИЗАЙН / 001</span><h2>{product.name}</h2><p>{product.subtitle}</p></div><button className="icon-button" onClick={reset} title="Сбросить"><RotateCcw size={17}/></button></div>
    <div className="view-toggle"><button className={!onMannequin?'active':''} onClick={()=>setOnMannequin(false)}>Изделие</button><button className={onMannequin?'active':''} onClick={()=>setOnMannequin(true)}>На манекене</button></div>
    <div className="canvas-wrap"><Scene kind={product.kind} color={color} roughness={fabric.roughness} metalness={fabric.metalness} texture={fabric.texture} decoration={decoration} placement={placement} onMannequin={onMannequin}/><div className="canvas-label"><span className="live-dot"/> 3D-ПРЕДПРОСМОТР</div><div className="canvas-hint"><RotateCcw size={13}/> Перетаскивайте, чтобы вращать</div><div className="canvas-index">01 <span>/</span> 03</div></div>
    <div className="preview-bottom"><div><span className="material-chip" style={{background:color}}/><span><strong>{fabric.name}</strong><small>Выбранный материал</small></span></div><div className="preview-bottom-right"><span className="status-dot"/> Изменения применяются сразу</div></div>
   </section>
   <aside className="customizer"><div className="customizer-head"><div><div className="eyebrow">ШАГ 03</div><h2>Детали дизайна</h2></div><button className="help-button" title="О прототипе" onClick={()=>flash('Это процедурная 3D-заготовка. Для реалистичной ткани нужны детализированные модели.') }><CircleHelp size={17}/></button></div>
    <div className="tabs">{[['fabric','Ткань'],['color','Цвет'],['decor','Декор']].map(([id,label])=><button key={id} className={activeTab===id?'active':''} onClick={()=>setActiveTab(id)}>{label}</button>)}</div>
    {activeTab==='fabric'&&<section className="custom-section"><div className="custom-title"><h3>Материал</h3><span>{fabrics.length} вариантов</span></div><div className="fabric-list">{fabrics.map(f=><button key={f.id} className={`fabric-option ${fabricId===f.id?'selected':''}`} onClick={()=>{setFabricId(f.id);setColor(f.color)}}><span className={`fabric-swatch swatch-${f.texture}`} style={{backgroundColor:f.color}}>{fabricId===f.id&&<Check size={15}/>}</span><span><strong>{f.name}</strong><small>{f.texture==='smooth'?'Гладкая фактура':f.texture==='woven'?'Текстильное плетение':'Бархатистая поверхность'}</small></span><span className="radio-mark">{fabricId===f.id?'●':'○'}</span></button>)}</div></section>}
    {activeTab==='color'&&<section className="custom-section"><div className="custom-title"><h3>Палитра</h3><span>{colors.length} оттенков</span></div><div className="color-grid">{colors.map(c=><button key={c.value} className={`color-option ${color===c.value?'selected':''}`} title={c.name} onClick={()=>setColor(c.value)}><span style={{backgroundColor:c.value}}>{color===c.value&&<Check size={16}/>}</span><small>{c.name}</small></button>)}</div><div className="custom-title custom-title-spaced"><h3>Свой оттенок</h3><span>{color.toUpperCase()}</span></div><label className="native-color"><span>Выберите цвет</span><input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label></section>}
    {activeTab==='decor'&&<section className="custom-section"><div className="custom-title"><h3>Декоративный элемент</h3></div><div className="decor-list">{decorations.map(d=><button key={d.id} className={`decor-option ${decoration===d.id?'selected':''}`} onClick={()=>setDecoration(d.id)}><span className="decor-symbol">{d.symbol||'—'}</span><span>{d.name}</span>{decoration===d.id&&<Check size={15}/>}</button>)}</div>{decoration!=='none'&&<><div className="custom-title custom-title-spaced"><h3>Расположение</h3></div><div className="placement-list">{placements.map(p=><button key={p.id} className={`placement-option ${placement===p.id?'selected':''}`} onClick={()=>setPlacement(p.id)}>{p.name}{placement===p.id&&<Check size={14}/>}</button>)}</div></>}<div className="decor-note"><Sparkles size={15}/><span>Декор демонстрационный. Следующий этап — нанесение графики по UV-развёртке каждой модели.</span></div></section>}
    <div className="order-card"><div className="order-card-top"><span>ВАША КОНФИГУРАЦИЯ</span><span className="order-number">№ 001</span></div><strong>{product.name}</strong><p>{fabric.name} · {colors.find(c=>c.value.toLowerCase()===color.toLowerCase())?.name||'Авторский оттенок'} · {decorations.find(d=>d.id===decoration)?.name}</p><button className="save-button" onClick={save}><ArrowDownToLine size={16}/> Сохранить дизайн <span>↗</span></button><small className="save-caption">Скачайте описание выбранной конфигурации</small></div>
   </aside>
  </main>
  <footer className="footer"><span>ATELIER © 2026</span><span>DESIGNED AROUND YOU</span><span>ДЕМОНСТРАЦИОННАЯ ВЕРСИЯ</span></footer>
  {notice&&<div className="toast" role="status"><span>{notice}</span><button onClick={()=>setNotice('')}><X size={15}/></button></div>}
 </div>
}
