export const categories = [
  { id:'dresses', label:'Платья', icon:'✳' },
  { id:'suits', label:'Жакеты и костюмы', icon:'◇' },
  { id:'bottoms', label:'Брюки и юбки', icon:'⌁' },
  { id:'blouses', label:'Рубашки и блузы', icon:'▤' },
  { id:'outerwear', label:'Пальто и верхняя одежда', icon:'◈' },
  { id:'bags', label:'Сумки и аксессуары', icon:'□' }
]
export const products = {
  dresses:[
    {id:'slip-dress',name:'Платье-комбинация',subtitle:'Лаконичный силуэт',kind:'dress'},
    {id:'evening-dress',name:'Вечернее платье',subtitle:'Выразительная форма',kind:'gown'},
    {id:'shirt-dress',name:'Платье-рубашка',subtitle:'Современная классика',kind:'shirtDress'}
  ],
  suits:[
    {id:'blazer',name:'Структурный жакет',subtitle:'Чёткая линия плеч',kind:'blazer'},
    {id:'pantsuit',name:'Костюмный комплект',subtitle:'Жакет и брюки',kind:'suit'},
    {id:'vest',name:'Удлинённый жилет',subtitle:'Архитектурный крой',kind:'vest'}
  ],
  bottoms:[
    {id:'wide-trousers',name:'Широкие брюки',subtitle:'Свободный силуэт',kind:'trousers'},
    {id:'pencil-skirt',name:'Юбка-карандаш',subtitle:'Чистая геометрия',kind:'pencilSkirt'},
    {id:'a-line-skirt',name:'Юбка А-силуэта',subtitle:'Мягкий объём',kind:'skirt'}
  ],
  blouses:[
    {id:'silk-blouse',name:'Шёлковая блуза',subtitle:'Мягкие линии',kind:'blouse'},
    {id:'classic-shirt',name:'Классическая рубашка',subtitle:'Точная посадка',kind:'shirt'},
    {id:'statement-top',name:'Топ с акцентом',subtitle:'Минимализм с деталями',kind:'top'}
  ],
  outerwear:[
    {id:'long-coat',name:'Длинное пальто',subtitle:'Элегантная длина',kind:'coat'},
    {id:'trench',name:'Тренч',subtitle:'Детали вне времени',kind:'trench'},
    {id:'cape',name:'Накидка',subtitle:'Свободная архитектура',kind:'cape'}
  ],
  bags:[
    {id:'top-handle',name:'Сумка с короткой ручкой',subtitle:'Геометричная форма',kind:'bag'},
    {id:'clutch',name:'Клатч',subtitle:'Вечерний аксессуар',kind:'clutch'},
    {id:'tote',name:'Сумка-тоут',subtitle:'Функциональный объём',kind:'tote'}
  ]
}
export const fabrics = [
  {id:'silk',name:'Шёлк',color:'#c6b49d',roughness:.28,metalness:.02,texture:'smooth'},
  {id:'wool',name:'Костюмная шерсть',color:'#77756d',roughness:.88,metalness:0,texture:'woven'},
  {id:'satin',name:'Атлас',color:'#9c797e',roughness:.22,metalness:.04,texture:'smooth'},
  {id:'tweed',name:'Твид',color:'#c4b9a4',roughness:.96,metalness:0,texture:'woven'},
  {id:'velvet',name:'Бархат',color:'#35433c',roughness:.94,metalness:0,texture:'velvet'},
  {id:'linen',name:'Лён',color:'#d7cfbd',roughness:.94,metalness:0,texture:'woven'}
]
export const colors = [
  {name:'Слоновая кость',value:'#e9e0d1'},{name:'Песочный',value:'#c6b49d'},
  {name:'Шоколад',value:'#49352e'},{name:'Чёрный',value:'#242323'},
  {name:'Бордо',value:'#6e2739'},{name:'Тёмно-зелёный',value:'#34483e'},
  {name:'Пудровый',value:'#cfaeac'},{name:'Синий',value:'#354e70'},
  {name:'Серый',value:'#85837e'},{name:'Белый',value:'#f6f3ed'}
]
export const decorations = [
  {id:'none',name:'Без декора',symbol:''},{id:'monogram',name:'Монограмма',symbol:'A'},
  {id:'floral',name:'Цветочная вышивка',symbol:'✿'},{id:'star',name:'Звёздный мотив',symbol:'✧'},
  {id:'ornament',name:'Орнамент',symbol:'❋'}
]
export const placements = [
  {id:'chest',name:'Грудь / передняя часть'},{id:'waist',name:'Талия'},
  {id:'hem',name:'Нижний край'},{id:'sleeve',name:'Рукав / бок'}
]
