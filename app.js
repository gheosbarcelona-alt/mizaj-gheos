'use strict';
/* Test Biotipologías Gheos v0.19 · PWA local. La rúbrica es una interpretación didáctica de la presentación adjunta, no un modelo de IA ni un método clínico validado. */
const $ = s=>document.querySelector(s);
const esc = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = d=>{try{return new Date(d).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'});}catch{return ''}};
const profile = {
 MURIATRICO:{alias:'Perfil equilibrado',energy:'',nature:'equilibrio morfológico orientativo',humor:'no definido',intro:'La categoría requiere comprobación profesional de la armonía morfológica y los criterios docentes; el color ocular por sí solo no la determina.',habits:['Mantener hábitos saludables adaptados a la persona.']},
 COLERICO:{alias:'Safravi',energy:'C-S',nature:'caliente y seco',humor:'bilis amarilla',intro:'Rasgos descritos en la presentación: cara triangular invertida, tronco relativamente corto, extremidades y manos largas, piel fina y cálida.',habits:['Regularidad de horarios y pausas de recuperación.','Evitar exposición excesiva al calor y procurar ambientes frescos.','Alternar actividad física con descanso suficiente.']},
 SANGUINEO:{alias:'Damavi',energy:'C-H',nature:'caliente y húmedo',humor:'sangre',intro:'Rasgos descritos: rostro cuadrado, estructura ancha y musculosa, tronco compacto, manos cuadradas y piel cálida y húmeda.',habits:['Actividad física regular adaptada a las capacidades.','Evitar el exceso de calor húmedo cuando resulte molesto.','Mantener horarios estables, especialmente para comidas y descanso.']},
 FLEMATICO:{alias:'Balghami',energy:'F-H',nature:'frío y húmedo',humor:'flema',intro:'Rasgos descritos: rostro redondo, contornos suaves, tronco ancho, manos anchas y carnosas y piel fría y húmeda.',habits:['Movimiento diario progresivo, adaptado a la capacidad física.','Evitar sedentarismo prolongado.','Favorecer un entorno templado y horarios de sueño regulares.']},
 MELANCOLICO:{alias:'Saudavi',energy:'F-S',nature:'frío y seco',humor:'bilis negra',intro:'Rasgos descritos: rostro rectangular o alargado, constitución más ósea, silueta delgada y piel fría y seca.',habits:['Rutinas predecibles de comidas y descanso.','Actividad física moderada y progresiva.','Procurar un entorno templado y estrategias de manejo del estrés.']}
};
const BIO_NAMES={COLERICO:'Colérico–Fosfórico',SANGUINEO:'Sanguíneo–Sulfúrico',FLEMATICO:'Flemático–Carbónico',MELANCOLICO:'Melancólico–Fluórico',MURIATRICO:'Muriátrico'};
const bioName=k=>BIO_NAMES[k]||'Sin determinar';
// Descripciones aportadas por Gheos para el contenido docente del test.
// Las asociaciones de terreno no son indicadores predictivos ni diagnósticos.
const BIO_CONTENT={
 SANGUINEO:{elemento:'aire',naturaleza:'caliente y húmedo',interes:'Necesita vivir experiencias, disfrutar del presente y generar un ambiente agradable a su alrededor. Busca la conexión social y tiende a evitar situaciones emocionalmente desagradables.',salud:'Manifestaciones respiratorias y alérgicas; sensibilidad al exceso de humedad.'},
 COLERICO:{elemento:'fuego',naturaleza:'caliente y seco',interes:'Necesita conseguir resultados, alcanzar objetivos y comprobar que las cosas funcionan correctamente. Valora la eficacia, la autonomía y el cumplimiento de los compromisos.',salud:'Esfera hepatobiliar, reactividad al estrés y alteraciones tensionales.'},
 MELANCOLICO:{elemento:'tierra',naturaleza:'frío y seco',interes:'Necesita comprender, analizar y encontrar coherencia en lo que sucede. Busca estructura, profundidad y seguridad a través del conocimiento.',salud:'Sobrecarga mental, rumiación, manifestaciones neurovegetativas y dificultades digestivas.'},
 FLEMATICO:{elemento:'agua',naturaleza:'frío y húmedo',interes:'Necesita mantener el bienestar emocional de las personas de su entorno. Busca seguridad afectiva, armonía y estabilidad en sus relaciones. Presenta una actitud cuidadora y protectora.',salud:'Sensibilidad digestiva, tendencia a acumular peso y posibles manifestaciones de retención de líquidos.'},
 MURIATRICO:{elemento:'',naturaleza:'perfil equilibrado',interes:'Perfil equilibrado o normotipo; se valora cuando la morfología y el patrón general aparecen muy compensados.',salud:'No se define una tendencia patológica específica para esta actitud en el esquema docente.'}
};
const VITAL_QUESTIONS={
 SANGUINEO:'Me motiva vivir experiencias, disfrutar del presente, conectar con otras personas y crear un ambiente agradable.',
 COLERICO:'Me motiva alcanzar objetivos, obtener resultados y comprobar que las cosas funcionan bien.',
 MELANCOLICO:'Me motiva comprender a fondo, analizar y encontrar coherencia y seguridad mediante el conocimiento.',
 FLEMATICO:'Me motiva cuidar del bienestar emocional de los demás y mantener seguridad afectiva, armonía y estabilidad.'
};
// Las respuestas orientan una hipótesis de trabajo. Se exige un máximo único >=2.
// Una confirmación manual tiene prioridad sobre la sugerencia del cuestionario.
function motivationAssessment(c){
 const marks=c.motivationScores||{};
 const evaluated=BIO_ORDER.filter(k=>Object.prototype.hasOwnProperty.call(marks,k)&&marks[k]!==''&&Number.isFinite(Number(marks[k])));
 const max=evaluated.length?Math.max(...evaluated.map(k=>Number(marks[k]))):-1;
 const leaders=evaluated.filter(k=>Number(marks[k])===max);
 const suggested=max>=2&&leaders.length===1?leaders[0]:'';
 const manual=BIO_CONTENT[c.motivationBio]?c.motivationBio:'';
 return {suggested,effective:manual||suggested,source:manual?'terapeuta':suggested?'cuestionario':'sin confirmar',max,tie:leaders.length>1&&max>=2,answered:evaluated.length};
}
function vitalDifference(c,d){
 const physical=d.bi, motive=d.motivation;
 if(!physical||!motive)return 'No es posible comparar aún la constitución y la motivación vital porque falta información.';
 if(physical==='MURIATRICO'||motive==='MURIATRICO')return 'El perfil muriátrico requiere una interpretación individual del terapeuta; no se asignan desequilibrios por discordancia de forma automática.';
 if(physical===motive)return 'La motivación vital dominante coincide con el biotipo constitucional en este modelo.';
 return `La constitución ${bioName(physical)} y la motivación vital ${bioName(motive)} son diferentes. Según la hipótesis interpretativa del curso, se consideran los desequilibrios asociados al perfil motivacional ${bioName(motive)}, sin atribuir por ello una enfermedad ni una relación causal demostrada.`;
}
const BIO_ORDER=['SANGUINEO','COLERICO','MELANCOLICO','FLEMATICO'];
const BIO_COLORS={SANGUINEO:'#be7851',COLERICO:'#b99c38',MELANCOLICO:'#6886a1',FLEMATICO:'#79a58c'};
const kinds={
 'C-S':{name:'Calientes y secos',food:['Orégano','Tomillo','Romero','Ajo','Cebolla','Pimienta negra','Guindilla','Jengibre seco','Canela','Clavo','Mostaza','Azafrán','Fenogreco','Comino','Cúrcuma','Nueces','Pollo'],caution:['Orégano','Tomillo','Romero','Cúrcuma','Pollo']},
 'C-H':{name:'Calientes y húmedos',food:['Trigo','Miel','Dátiles','Mango','Plátano','Melocotón','Almendras','Pistachos','Cordero','Hígado','Leche','Espinaca','Azúcar'],caution:['Leche','Espinaca','Azúcar']},
 'F-H':{name:'Fríos y húmedos',food:['Pepino','Lechuga','Calabaza','Calabacín','Sandía','Melón','Pera','Habas frescas','Cilantro fresco','Higos frescos','Remolacha'],caution:['Higos frescos','Remolacha']},
 'F-S':{name:'Fríos y secos',food:['Cebada','Granada ácida','Limón','Vinagre','Tamarindo','Lentejas','Yogur natural','Tomate','Col','Coliflor','Patata','Maíz','Guisantes','Manzana','Coco'],caution:['Lentejas','Yogur natural','Tomate','Col','Coliflor','Patata','Maíz','Guisantes','Manzana','Coco']}
};
const opposite={'C-S':'F-H','C-H':'F-S','F-H':'C-S','F-S':'C-H'};
const supplementOptions=[
 {id:'oxidative',label:'Estrés oxidativo o fatiga mitocondrial'},
 {id:'lymph',label:'Retención de líquidos o congestión linfática'},
 {id:'brainfog',label:'Niebla mental o pesadez de cabeza'},
 {id:'metabolic',label:'Síndrome metabólico, resistencia a la insulina o metabolismo lento'},
 {id:'lipids',label:'Alteraciones del perfil lipídico o apoyo cardiovascular'},
 {id:'hepatic',label:'Detox hepática o congestión hepato-intestinal'},
 {id:'gut_lower',label:'Problemas digestivos intestinales'},
 {id:'gut_upper',label:'Problemas digestivos altos o hipoclorhidria'},
 {id:'sleep_stress',label:'Insomnio, inquietud o fase de estrés'},
 {id:'low_energy',label:'Falta de energía o cansancio'},
 {id:'memory',label:'Memoria, enfoque mental o sistema nervioso'},
 {id:'thyroid',label:'Hipotiroidismo o metabolismo ralentizado'}
];
const supplementMatrix={
 SANGUINEO:{
  oxidative:['Chaga Gheos Bio'],
  lymph:['Polyporus Gheos','Dren Gheos Funcional'],
  brainfog:['Poria Cocos Gheos'],
  metabolic:['Maitake Gheos Bio','Shiitake Gheos Bio','Shimap'],
  lipids:['Lipoberina','Ganoderma Gheos','Auricularia'],
  hepatic:['Toxirid SG']
 },
 COLERICO:{
  oxidative:['Chaga Gheos Bio'],
  gut_lower:['Hericium Gheos Bio','Hericium Gut','Gut Mix'],
  lipids:['Omega Funcional'],
  sleep_stress:['Ganoderma Gheos Bio','Micotwin Zen','Ansirid Now'],
  brainfog:['Treolibe','Poria Cocos Gheos'],
  memory:['Hericium Gheos Bio','Treolibe']
 },
 MELANCOLICO:{
  low_energy:['Cordyceps Gheos Bio','Micotwin Energy','Adrenoplus SG'],
  gut_upper:['Hericium Up','Gastro Mix'],
  lipids:['Omega Funcional'],
  sleep_stress:['Ganoderma Gheos Bio','Trigheos Hipo','Trigheos Hiper'],
  oxidative:['Condriomix']
 },
 FLEMATICO:{
  gut_upper:['Digerblend','Panc Mix'],
  low_energy:['Cordyceps Gheos Bio','Micotwin Energy'],
  brainfog:['Poria Cocos Gheos'],
  lymph:['Polyporus Gheos','Dren Gheos Funcional','Poria Cocos Gheos'],
  metabolic:['Shiitake Gheos Bio','Maitake Gheos Bio','Coprinus Gheos Bio','Micotwin Diab'],
  thyroid:['Tireo Cell','Meta Klim']
 },
 MURIATRICO:{}
};

const morph=[
 {id:'face',name:'Forma general de la cara',detail:'Si la foto frontal no permite apreciarlo, observa el rostro presencialmente.',weight:3,options:[['','No evaluable'],['COLERICO','Triangular invertida: frente amplia, mandíbula estrecha'],['SANGUINEO','Cuadrada: frente y mandíbula de anchura semejante'],['FLEMATICO','Redonda u ovalada de contornos suaves'],['MELANCOLICO','Rectangular, estrecha o alargada']]},
 {id:'body',name:'Proporción entre tronco y extremidades',detail:'Comparar tronco y longitud relativa de brazos y piernas; no requiere mediciones biométricas automáticas.',weight:3,options:[['','No evaluable'],['COLERICO','Tronco corto, extremidades proporcionalmente largas'],['SANGUINEO','Tronco ancho/compacto y extremidades más cortas'],['FLEMATICO','Tronco redondeado/ancho y extremidades cortas'],['MELANCOLICO','Cuerpo alargado, delgado y estructura ósea visible']]},
 {id:'hands',name:'Forma de las manos',detail:'Usa una fotografía adicional o examen presencial.',weight:3,options:[['','No evaluable'],['COLERICO','Largas, dedos finos, articulaciones definidas'],['SANGUINEO','Palmas y dedos robustos, manos más cuadradas'],['FLEMATICO','Anchas, carnosas, contornos suaves'],['MELANCOLICO','Estrechas, óseas, tendones marcados']]},
 {id:'skin',name:'Temperatura y humedad habitual de manos/piel',detail:'No puede inferirse el tacto ni la temperatura real a partir de una fotografía.',weight:2,options:[['','No evaluable'],['COLERICO','Cálidas y secas'],['SANGUINEO','Cálidas y húmedas'],['FLEMATICO','Frías y húmedas'],['MELANCOLICO','Frías y secas']]},
 {id:'texture',name:'Textura de piel y tejido subcutáneo',detail:'Confirmar por observación directa o con la persona.',weight:2,options:[['','No evaluable'],['COLERICO','Piel fina; musculatura fibrosa y marcada'],['SANGUINEO','Piel suave; musculatura robusta'],['FLEMATICO','Piel suave; tejido subcutáneo blando'],['MELANCOLICO','Piel áspera o seca; prominencias óseas']]},
 {id:'shoulders',name:'Hombros, caderas y silueta',detail:'Orientativo y variable con edad y actividad física.',weight:1,options:[['','No evaluable'],['COLERICO','Hombros marcados, caderas relativamente estrechas'],['SANGUINEO','Tronco ancho, estructura fuerte'],['FLEMATICO','Silueta redondeada, contornos blandos'],['MELANCOLICO','Silueta estrecha, larga, posibles asimetrías']]},
 {id:'veins',name:'Venas, tendones y articulaciones visibles',detail:'Cambian con grasa corporal, luz, temperatura y edad.',weight:1,options:[['','No evaluable'],['COLERICO','Venas y articulaciones marcadas'],['SANGUINEO','Aspecto robusto, musculoso'],['FLEMATICO','Poco marcadas, tejido blando'],['MELANCOLICO','Relieves óseos y tendinosos visibles']]},
 {id:'climate',name:'Entorno climático que suele resultar más cómodo',detail:'Autodeclaración, no inferida de la fotografía.',weight:1,options:[['','No evaluable'],['COLERICO','Fresco y ventilado'],['SANGUINEO','Calor seco; malestar con humedad excesiva'],['FLEMATICO','Templado o cálido y ventilado'],['MELANCOLICO','Templado, estable, sin cambios bruscos']]}
];
const symptoms=[
 {group:'Temperatura',axis:'hot',name:'Calor corporal o intolerancia al calor',note:'¿Empeora con el calor y busca ambientes frescos?'},
 {group:'Temperatura',axis:'hot',name:'Sed importante o ardor',note:'La sed también puede indicar necesidades médicas de hidratación.'},
 {group:'Temperatura',axis:'hot',name:'Enrojecimiento o calor local',note:'No equivale a una causa específica.'},
 {group:'Temperatura',axis:'hot',name:'Fiebre medida',note:'La fiebre necesita valoración médica según el contexto.'},
 {group:'Temperatura',axis:'cold',name:'Sensación persistente de frío o manos frías',note:'¿Prefiere ambientes cálidos?'},
 {group:'Temperatura',axis:'cold',name:'Intolerancia al clima frío',note:''},
 {group:'Temperatura',axis:'cold',name:'Digestiones lentas con sensación de frío',note:'Si hay dolor o pérdida de peso, valorar clínicamente.'},
 {group:'Humedad/sequedad',axis:'wet',name:'Secreciones nasales o flemas abundantes',note:'Síntoma inespecífico.'},
 {group:'Humedad/sequedad',axis:'wet',name:'Salivación excesiva',note:''},
 {group:'Humedad/sequedad',axis:'wet',name:'Hinchazón o retención de líquidos',note:'Puede requerir evaluación clínica.'},
 {group:'Humedad/sequedad',axis:'wet',name:'Somnolencia y sensación de pesadez',note:''},
 {group:'Humedad/sequedad',axis:'dry',name:'Boca o mucosas secas',note:''},
 {group:'Humedad/sequedad',axis:'dry',name:'Piel seca, tirante o áspera',note:''},
 {group:'Humedad/sequedad',axis:'dry',name:'Tos seca o escasez de secreciones',note:''},
 {group:'Humedad/sequedad',axis:'dry',name:'Estreñimiento con heces duras',note:''},
 {group:'Humedad/sequedad',axis:'dry',name:'Insomnio o sueño reducido',note:'El insomnio tiene muchas causas.'}
];
// Listas reemplazadas íntegramente a partir de las páginas 5 y 6 de
// «IMPRMIR PRESENTACION ESTAS BIEN.pdf» (documento aportado por el usuario).
const blueGroups={
 'Situación azul · página 5':[
 'Fatiga crónica','Depresión','Pérdida de cabello','Tinnitus / acúfenos',
 'Uñas frágiles','Mareos / vértigos','Dolores de cabeza','Dolor articular',
 'Piel y cabello secos','Ansiedad','Esterilidad',
 'Problemas con el ciclo menstrual (PMS)','Ovarios poliquísticos / miomas',
 'Celulitis','Osteoporosis','Piedras / calculosis',
 'Infecciones bacterianas de repetición','Mala tolerancia al alcohol',
 'Dar «chispazo»'
 ]
};
const yellowGroups={
 'Situación amarilla · página 6':[
 'Gastritis / reflujo','Diabetes mellitus','Gases / hinchazón abdominal',
 'Mal aliento por la mañana','Tos','Diverticulitis','Pólipos intestinales',
 'Varices / hemorroides','Problemas de piel (psoriasis, dermatitis, acné)',
 'Alergias','Artritis','Herpes / gripes recurrentes (infecciones víricas)',
 'Sequedad de mucosas (síndrome de Sjögren)','Enfermedades autoinmunes'
 ]
};
const validListItems=group=>new Set(Object.values(group).flat());
const BLUE_ITEMS=validListItems(blueGroups),YELLOW_ITEMS=validListItems(yellowGroups);
const selectedItems=(c,color)=>Array.isArray(c[color])?c[color].filter(item=>(color==='blue'?BLUE_ITEMS:YELLOW_ITEMS).has(item)):[];
let vault={cases:{},active:null}; let screen='cases'; let serverLocal=false;
const DBNAME='mizaj-gheos-v04'; const STORE='data';
const DB=()=>new Promise((resolve,reject)=>{let req=indexedDB.open(DBNAME,1); req.onupgradeneeded=()=>req.result.createObjectStore(STORE); req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
async function getRaw(name){const db=await DB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(name);r.onsuccess=()=>{resolve(r.result);db.close()};r.onerror=()=>reject(r.error)});}
async function setRaw(name,value){const db=await DB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,name);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)})}
const bytes=x=>new TextEncoder().encode(x), dec=x=>new TextDecoder().decode(x);
const toB64=u=>btoa(Array.from(u,b=>String.fromCharCode(b)).join(''));
const fromB64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function derive(pw,salt){const raw=await crypto.subtle.importKey('raw',bytes(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:230000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function encryptCase(){const iv=crypto.getRandomValues(new Uint8Array(12));const payload=bytes(JSON.stringify({cases:vault.cases,active:vault.active,version:4}));const crypt=await crypto.subtle.encrypt({name:'AES-GCM',iv},vault.key,payload);return {version:4,salt:toB64(vault.salt),iv:toB64(iv),data:toB64(new Uint8Array(crypt)),updated:new Date().toISOString()};}
async function persist(){await setRaw('open-v06',{version:7,cases:vault.cases,active:vault.active,updated:new Date().toISOString()});}
function fresh(){return {id:(crypto.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2)),created:new Date().toISOString(),updated:new Date().toISOString(),name:'',surnames:'',gender:'',age:'',phone:'',email:'',health:'',diet:'',allergies:'',medicine:'',state:'equilibrium',photos:{},morph:{},energy:{},blue:[],yellow:[],manualBio:'',motivationBio:'',motivationScores:{},supplementFocus:'',eyeColor:'',notes:'',photoConsent:false,consents:[],photoAnalysis:null,photoReview:{},photoReviewApplied:null};}
function current(){return vault.cases[vault.active]||null;}
function activeSet(s){screen=s;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.screen===s));$('#screen-title').textContent=({'cases':'Casos','identity':'Identificación','photos':'Fotografías','morph':'Morfología constitucional','symptoms':'Síntomas y naturaleza actual','duarte':'Cuestionarios de Duarte','report':'Orientación e informe'})[s];$('#current-subtitle').textContent=s==='cases'?'ARCHIVO LOCAL':'FICHA · '+(current()?esc(current().name+' '+current().surnames):'SIN SELECCIONAR');$('#active-case-label').textContent=current()?`${current().name||'Sin nombre'} ${current().surnames||''}`:'';$('#save-case').classList.toggle('hidden',!current());render()}
function notice(msg){let e=$('#notice');e.textContent=msg;e.classList.remove('hidden');clearTimeout(notice._timer);notice._timer=setTimeout(()=>e.classList.add('hidden'),4500)}
async function update(fn){const c=current();if(!c)return;fn(c);c.updated=new Date().toISOString();await persist()}
const SCREEN_FLOW=['identity','photos','morph','symptoms','duarte','report'];
function advance(s){const idx=SCREEN_FLOW.indexOf(s);const previous=SCREEN_FLOW[idx-2];return `<div class="steps">${previous?`<button type="button" class="secondary" data-next="${previous}">← Anterior</button>`:''}<button type="button" class="primary" data-next="${s}">Continuar →</button></div>`;}

function render(){const c=current();const root=$('#screen-content');if(screen!=='cases'&&!c){root.innerHTML='<div class="panel">Primero crea o selecciona un caso.</div>';return}root.innerHTML=({cases:renderCases,identity:renderIdentity,photos:renderPhotos,morph:renderMorph,symptoms:renderSymptoms,duarte:renderDuarte,report:renderReport})[screen](c); bindControls();}
function renderCases(){const rows=Object.values(vault.cases).sort((a,b)=>b.updated.localeCompare(a.updated));return `<div class="panel"><h2>Archivo de pacientes</h2><p class="muted">Los casos se guardan únicamente en este navegador. «Guardar copia de seguridad» permite conservarlos si cambias de ordenador o se borran los datos del navegador. La copia no está cifrada.</p><div class="toolbar"><button id="new-case" class="primary">+ Nuevo caso</button><button id="export-data" class="secondary">Guardar copia de seguridad</button><label class="secondary" style="cursor:pointer">Restaurar una copia <input id="import-data" type="file" accept="application/json,.json" hidden></label></div><input id="search-cases" placeholder="Buscar por nombre o apellidos" aria-label="Buscar casos"><div id="case-list">${rows.length? rows.map(c=>`<div class="case-row" data-name="${esc((c.name+' '+c.surnames).toLowerCase())}"><div><div class="case-name">${esc(c.name+' '+c.surnames)||'Sin nombre'}</div><div class="case-meta">${esc(c.age||'–')} años · ${esc(c.gender||'Sin género registrado')} · Editado ${fmt(c.updated)}</div></div><div class="toolbar"><button class="secondary small" data-open="${esc(c.id)}">Abrir</button><button class="danger small" data-delete="${esc(c.id)}">Eliminar</button></div></div>`).join(''):'<p class="hint">No hay casos guardados. Crea el primero.</p>'}</div></div><div class="warning">Sin contraseña, los casos y fotografías quedan guardados sin cifrar en este navegador. Cualquier persona con acceso al dispositivo o al perfil del navegador podría consultarlos. Usa un equipo protegido y exporta copias de seguridad a una ubicación segura. No incluyas datos personales reales si el dispositivo es compartido.</div>`;}
function field(name,label,type='text',placeholder='',req=false){const c=current();return `<div class="field"><label for="f-${name}">${label}${req?' *':''}</label><input id="f-${name}" data-field="${name}" type="${type}" ${req?'required':''} value="${esc(c[name]||'')}" placeholder="${esc(placeholder)}"></div>`}
function renderIdentity(c){return `<div class="panel"><h2>Identificación del caso</h2><p class="muted">Los datos identificativos se guardan localmente en este navegador, sin cifrado.</p><div class="grid-2">${field('name','Nombre','text','',true)}${field('surnames','Apellidos','text','',true)}${field('age','Edad','number','',true)}<div class="field"><label for="gender">Género</label><select id="gender" data-field="gender"><option value="">Seleccionar</option>${['Mujer','Hombre','No binario','Otro','Prefiere no indicar'].map(x=>`<option ${c.gender===x?'selected':''}>${x}</option>`).join('')}</select></div>${field('phone','Teléfono','tel')}${field('email','Correo electrónico','email')}<div class="field"><label>Color de ojos (observación complementaria)</label><select data-field="eyeColor"><option value="">No indicado</option>${['Marrón oscuro','Marrón claro','Avellana','Verde','Azul','Gris','Otro'].map(v=>`<option value="${v}" ${c.eyeColor===v?'selected':''}>${v}</option>`).join('')}</select></div></div><div class="grid-2" style="margin-top:18px"><div class="field"><label>Situación actual</label><select data-field="state"><option value="equilibrium" ${c.state==='equilibrium'?'selected':''}>Se encuentra en equilibrio / mantenimiento</option><option value="symptoms" ${c.state==='symptoms'?'selected':''}>Presenta síntomas o problemas de salud</option></select></div><div class="field"><label>Alimentación o restricciones declaradas</label><input data-field="diet" value="${esc(c.diet)}" placeholder="Vegetariana, sin gluten, etc."></div></div><div class="field" style="margin-top:16px"><label>Problema de salud o motivo de consulta (descripción literal)</label><textarea data-field="health" rows="3" placeholder="Describir sin interpretar el diagnóstico">${esc(c.health)}</textarea></div><div class="grid-2" style="margin-top:16px"><div class="field"><label>Alergias e intolerancias alimentarias</label><textarea data-field="allergies" rows="2">${esc(c.allergies)}</textarea></div><div class="field"><label>Tratamientos, condiciones y precauciones relevantes</label><textarea data-field="medicine" rows="2" placeholder="Por ejemplo, enfermedad renal, embarazo, diabetes, etc.">${esc(c.medicine)}</textarea></div></div><div class="field" style="margin-top:16px"><label>Notas profesionales</label><textarea data-field="notes" rows="2">${esc(c.notes)}</textarea></div></div>${advance('photos')}`}
const ph=[['face','Rostro frontal','user'],['full','Cuerpo entero (con ropa)','environment'],['hands','Manos (opcional)','environment']];
const PHOTO_REVIEW_FIELDS=[
 ['face','Rostro','face','Forma general del rostro','Rostro frontal, luz homogénea. Evitar inferir rasgos ocultos por el pelo o el ángulo.'],
 ['body','Tronco y extremidades','full','Proporción corporal','Cuerpo entero; observar longitud del tronco y las extremidades, no el tamaño absoluto.'],
 ['shoulders','Hombros, cintura y caderas','full','Silueta corporal','Revisar contornos sin confundir ropa, brazos o postura con la anchura del tronco.'],
 ['hands','Manos','hands','Morfología de la mano','Fotografía con dedos separados, sin distorsión de perspectiva.'],
 ['veins','Relieves óseos y tendinosos','full','Relieves observables','La visibilidad cambia según luz, edad y tejido corporal; no inferir características no observables.']
];
const PHOTO_GUIDE={
 COLERICO:'Fosfórico: frente amplia y mandíbula estrecha; tronco relativamente corto, extremidades largas, manos largas y articulaciones marcadas.',
 SANGUINEO:'Sulfúrico: rostro cuadrado, tronco ancho y compacto, estructura robusta y manos más cuadradas.',
 FLEMATICO:'Carbónico: rostro redondo u ovalado, contornos corporales suaves, extremidades relativamente cortas y manos anchas.',
 MELANCOLICO:'Fluórico: rostro alargado o rectangular, silueta más estrecha y alargada, relieves óseos o tendinosos visibles.',
 MURIATRICO:'Muriátrico: armonía general de proporciones sin un predominio claro. Requiere valoración global del profesional.'
};
function photoReviewScore(c){
 const votes=Object.fromEntries(BIO_ORDER.map(k=>[k,0]));let answered=0;
 for(const [id] of PHOTO_REVIEW_FIELDS){const b=c.photoReview?.[id];const photo=PHOTO_REVIEW_FIELDS.find(f=>f[0]===id)?.[2];if(b&&c.photos?.[photo]&&Object.hasOwn(votes,b)){const q=morph.find(x=>x.id===id);votes[b]+=q?.weight||1;answered++}}
 const ranked=Object.entries(votes).sort((a,b)=>b[1]-a[1]);
 const suggestion=answered>=3&&ranked[0][1]>=ranked[1][1]+3?ranked[0][0]:'';
 return {votes,answered,suggestion};
}
function photoReviewPanel(c){const r=photoReviewScore(c);return `<div class="panel photo-review"><h2>Revisión morfológica de las fotografías</h2><p class="muted">Selecciona únicamente las características que observes en las imágenes. La revisión es editable y no modifica la clasificación hasta pulsar «Incorporar al cuestionario».</p><div class="photo-guide-grid">${Object.entries(PHOTO_GUIDE).map(([k,v])=>`<div class="guide-card"><b>${bioName(k)}</b><p>${esc(v)}</p></div>`).join('')}</div><div class="review-rows">${PHOTO_REVIEW_FIELDS.map(([id,title,src,subtitle,help])=>{const q=morph.find(x=>x.id===id);return `<div class="review-row"><div class="review-description">${c.photos?.[src]?`<img class="review-thumb" src="${c.photos[src]}" alt="Fotografía de referencia para ${esc(title)}" loading="lazy">`:'<span class="review-thumb review-thumb-empty">Sin foto</span>'}<div><b>${title}</b><small>Referencia: ${esc(src==='full'?'cuerpo entero':src==='face'?'rostro frontal':'manos')} · ${c.photos?.[src]?'Foto disponible':'Añade la foto para habilitar'}</small><p>${esc(help)}</p></div></div><select data-photo-review="${id}" ${!c.photos?.[src]?'disabled':''} aria-label="Revisión: ${title}"><option value="">No evaluable / pendiente</option>${q.options.filter(a=>a[0]).map(([key,lab])=>`<option value="${key}" ${c.photoReview?.[id]===key?'selected':''}>${esc(lab)}</option>`).join('')}</select></div>`}).join('')}</div><div class="photo-review-summary"><strong>${r.answered} de ${PHOTO_REVIEW_FIELDS.length} rasgos revisados</strong><div class="photo-review-bars">${BIO_ORDER.map(k=>`<div class="photo-review-bar"><span>${bioName(k)}</span><b>${r.votes[k]} pt</b></div>`).join('')}</div><p>${r.suggestion?'Coincidencia morfológica provisional de la revisión: <b>'+bioName(r.suggestion)+'</b>.':'No hay un predominio suficientemente claro entre los rasgos revisados.'}</p></div><div class="toolbar"><button type="button" class="primary" id="apply-photo-review" ${!r.answered?'disabled':''}>Incorporar rasgos al cuestionario</button><button type="button" class="plain" id="clear-photo-review">Limpiar esta revisión</button></div>${c.photoReviewApplied?.at?`<p class="fine">Última incorporación al cuestionario: ${fmt(c.photoReviewApplied.at)} · ${c.photoReviewApplied.count} rasgos.</p>`:''}<p class="fine">Criterios observacionales del material docente: láminas de morfología de las págs. 44, 48, 52 y 56 y constituciones de las págs. 120-128. Las fotos no permiten valorar temperatura real de piel, vitalidad, enfermedades ni temperamento psicológico.</p></div>`}

function photoAnalysisPanel(c){const a=c.photoAnalysis;return `<div class="panel photo-analysis"><h2>Medición automática orientativa</h2><p class="muted">Analiza el contorno de la fotografía de cuerpo entero sobre fondo uniforme, sin salir del navegador. Calcula la relación visual entre hombros, cintura y caderas. No reconoce por sí sola la constitución ni sustituye la observación directa.</p><div class="toolbar"><button type="button" id="analyze-full-photo" class="secondary" ${!c.photos?.full||!c.photoConsent?'disabled':''}>Medir proporciones de la foto</button>${a?'<button type="button" id="clear-photo-analysis" class="plain">Descartar medición</button>':''}</div>${a?`<div class="photo-metrics"><p><b>Evaluación técnica:</b> ${esc(a.note)}</p>${a.ok?`<div class="stat-grid"><div class="stat"><b>${esc(a.shoulderWaist)}</b>Hombros / cintura (aproximado)</div><div class="stat"><b>${esc(a.hipShoulder)}</b>Caderas / hombros (aproximado)</div></div><p class="hint">${esc(a.suggestion)}</p>`:'<p class="hint">Si el fondo o la postura impiden medir con fiabilidad, utiliza la revisión morfológica de más abajo.</p>'}</div>`:''}<p class="fine">Estas proporciones pueden incluir brazos, ropa y sombras. Son indicadores geométricos, no puntuaciones diagnósticas ni una clasificación automática del biotipo.</p></div>`;}
async function analyzeFullPhoto(dataUrl){
 const img=new Image();img.src=dataUrl;await img.decode();const w=240,h=Math.max(180,Math.round(img.naturalHeight*240/img.naturalWidth));const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h).data;
 // Approximate backdrop from four corner patches; bright/neutral uniform backdrop only.
 const corners=[[4,4],[w-5,4],[4,h-5],[w-5,h-5]];const avg=[0,0,0];for(const [x,y] of corners){const i=(y*w+x)*4;for(let k=0;k<3;k++)avg[k]+=pixels[i+k]/4;}
 let backgroundVariance=0;for(const [x,y] of corners){const i=(y*w+x)*4;backgroundVariance+=Math.hypot(pixels[i]-avg[0],pixels[i+1]-avg[1],pixels[i+2]-avg[2])/4;}
 if(backgroundVariance>38)return {ok:false,note:'El fondo no parece suficientemente uniforme.'};
 const rows=[],lengths=[];let miny=h,maxy=0;for(let y=0;y<h;y++){let xMin=w,xMax=-1,n=0;for(let x=3;x<w-3;x++){const i=(y*w+x)*4;const diff=Math.hypot(pixels[i]-avg[0],pixels[i+1]-avg[1],pixels[i+2]-avg[2]);if(diff>65){xMin=Math.min(xMin,x);xMax=Math.max(xMax,x);n++;}}rows.push([xMin,xMax]);lengths.push(n);if(n>8){miny=Math.min(miny,y);maxy=Math.max(maxy,y)}}
 const height=maxy-miny;if(height<Math.round(h*.55)||height<=0)return {ok:false,note:'No se detecta una figura corporal suficientemente completa.'};
 const band=(pos,span=.035)=>{let arr=[];const center=Math.round(miny+height*pos),k=Math.max(2,Math.round(height*span));for(let y=Math.max(0,center-k);y<=Math.min(h-1,center+k);y++){const [a,b]=rows[y];if(b>a&&lengths[y]>8)arr.push(b-a+1);}arr.sort((a,b)=>a-b);return arr.length?arr[Math.floor(arr.length/2)]:0};
 const shoulders=band(.25),waist=band(.54),hips=band(.64);
 if(Math.min(shoulders,waist,hips)<12||Math.max(shoulders,waist,hips)>w*.85)return {ok:false,note:'La silueta se confunde con el fondo o queda parcialmente fuera de la fotografía.'};
 const sw=shoulders/waist,hs=hips/shoulders;
 // Describe geometry, never assign a constitutional category from an unvalidated algorithm.
 let hint='Las proporciones son relativamente equilibradas; revisar su distribución visual.';
 if(sw>1.28)hint='Hombros proporcionalmente más anchos que la cintura; comprobar si los brazos influyen en la medida.';
 else if(sw<1.04)hint='Hombros y cintura de anchura aparente parecida; revisar la constitución y el tejido subcutáneo.';
 if(hs>1.08)hint+=' Las caderas aparecen relativamente anchas.';
 return {ok:true,shoulderWaist:sw.toFixed(2),hipShoulder:hs.toFixed(2),note:'Proporciones aparentes estimadas. Revisión profesional necesaria.',suggestion:hint,reviewed:'',createdAt:new Date().toISOString()};
}
function renderPhotos(c){return `<div class="panel"><h2>Fotografías del caso</h2><div class="hint">Puedes tomar imágenes con la cámara del móvil o elegirlas de la galería. Con una fotografía frontal de cuerpo entero y fondo uniforme, puedes realizar una medición orientativa de proporciones que después debe revisar el profesional.</div><label class="check-item" style="margin:12px 0 18px"><input type="checkbox" id="photo-consent" ${c.photoConsent?'checked':''}><span>Confirmo que existe consentimiento informado para tomar y guardar fotografías en esta ficha local.</span></label><div class="photo-grid">${ph.map(([id,label,cap])=>`<div class="photo"><div>${c.photos[id]?`<img src="${c.photos[id]}" alt="${esc(label)}">`:`<div class="placeholder">${esc(label)}<br>Sin fotografía</div>`}</div><div class="photo-controls"><b>${esc(label)}</b><label class="capture">📷 Hacer foto <input type="file" accept="image/*" capture="${cap}" data-photo="${id}" hidden></label><label class="capture">▧ Galería <input type="file" accept="image/*" data-photo="${id}" hidden></label>${c.photos[id]?`<button data-remove-photo="${id}" class="danger small">Borrar foto</button>`:''}</div></div>`).join('')}</div>${photoAnalysisPanel(c)}${photoReviewPanel(c)}<p class="fine" style="margin-top:16px">Los botones de captura se habilitan al marcar la autorización anterior. Solicita consentimiento específico para fotografiar. Evita imágenes innecesariamente identificativas y no fotografíes a menores sin autorización del representante legal.</p></div>${advance('morph')}`;}
function renderMorph(c){const score=morphScores(c),valid=score.n;return `<div class="panel"><h2>Evaluación morfológica guiada</h2><div class="hint">Selecciona la descripción que corresponda a la persona. Si un rasgo no se aprecia con claridad, selecciona «No evaluable».</div>${morph.map(q=>`<div class="q-row"><div class="q-top"><div><div class="q-name">${q.name}</div><div class="q-desc">${q.detail}</div></div><select data-morph="${q.id}" aria-label="${esc(q.name)}">${q.options.map(([id,v])=>`<option value="${esc(id)}" ${c.morph[q.id]===id?'selected':''}>${esc(v)}</option>`).join('')}</select></div></div>`).join('')}</div><div class="panel"><h2>Motivación personal y objetivos vitales</h2><p class="muted">Indica cuánto representa cada afirmación los objetivos que suelen dirigir las decisiones de la persona. Después, el terapeuta puede confirmar o corregir el perfil sugerido.</p><div class="vital-question-list">${BIO_ORDER.map(k=>`<div class="vital-question"><div><strong>${bioName(k)} · ${BIO_CONTENT[k].elemento} · ${BIO_CONTENT[k].naturaleza}</strong><p>${esc(VITAL_QUESTIONS[k])}</p></div><select data-motivation-score="${k}" aria-label="Grado de identificación: ${bioName(k)}"><option value="" ${c.motivationScores?.[k]==null?'selected':''}>Sin valorar</option>${[[0,'Nada'],[1,'Poco'],[2,'Bastante'],[3,'Mucho']].map(([v,label])=>`<option value="${v}" ${Number(c.motivationScores?.[k])===v && c.motivationScores?.[k]!=null?'selected':''}>${label}</option>`).join('')}</select></div>`).join('')}</div>${(()=>{const x=motivationAssessment(c);return `<div class="vital-result"><strong>Perfil motivacional sugerido: ${x.suggested?bioName(x.suggested):'Sin predominio definido'}</strong><p class="fine">${x.tie?'Hay puntuaciones máximas iguales; revisa con el terapeuta.':x.answered?'Sugerencia basada únicamente en las respuestas a los objetivos vitales.':'Responde las afirmaciones para obtener una sugerencia.'}</p></div>`})()}<div class="field" style="margin-top:16px"><label>Confirmación o corrección del terapeuta (opcional)</label><select data-field="motivationBio"><option value="">Sin confirmar; usar la sugerencia del cuestionario</option>${[...BIO_ORDER,'MURIATRICO'].map(k=>`<option value="${k}" ${c.motivationBio===k?'selected':''}>${bioName(k)}</option>`).join('')}</select></div><p class="fine">Cuando los objetivos vitales dominantes no coinciden con el biotipo constitucional, el informe distingue ambos e indica los desequilibrios tradicionalmente asociados al perfil motivacional, sin predecir enfermedades.</p></div><div class="panel"><h2>Coincidencias morfológicas provisionales</h2><p>Rasgos evaluados: <strong>${valid} de ${morph.length}</strong>. Puntuaciones orientativas (no son probabilidades):</p><div class="stat-grid">${Object.keys(profile).map(k=>`<div class="stat"><b>${bioName(k)}</b>${score.scores[k]} puntos</div>`).join('')}</div>${score.possibleMuriatrico?'<div class="hint">Perfil morfológico equilibrado: valorar Muriátrico con criterio profesional (no asignación automática).</div>':''}${c.photoReviewApplied?.at?`<div class="hint">Se han incorporado ${c.photoReviewApplied.count} observaciones revisadas desde fotografías. Puedes modificar cualquiera de ellas aquí.</div>`:''}<div class="field" style="margin-top:16px"><label>Confirmación o corrección profesional del biotipo</label><select data-field="manualBio"><option value="">Sin confirmar: usar únicamente sugerencia provisional</option>${Object.keys(profile).map(k=>`<option value="${k}" ${c.manualBio===k?'selected':''}>${bioName(k)}</option>`).join('')}</select></div></div>${advance('symptoms')}`;}

function supplementFocusLabel(id){const x=supplementOptions.find(o=>o.id===id);return x?x.label:''}
function productChips(items){return `<div class="food-chips product-chips">${(items||[]).map(x=>`<span class="food-chip product">${esc(x)}</span>`).join('')}</div>`}
function supplementAdvice(c){const d=reportData(c);const bi=d.bi||'';const focus=c.supplementFocus||'';if(!focus)return {bi,focus,items:[],label:'',note:'No se ha seleccionado todavía un foco prioritario para la orientación de suplementación.'};let items=(supplementMatrix[bi]&&supplementMatrix[bi][focus])||[];let note='Orientación basada en el biotipo constitucional y el foco principal declarado en el cuestionario.';if(!items.length && bi==='MURIATRICO'){note='El perfil se ha considerado equilibrado o muriátrico. Conviene individualizar la suplementación según el foco clínico principal y el criterio profesional.'}else if(!items.length){note='No hay una combinación específica preconfigurada para este biotipo y este foco. Conviene individualizar según el criterio profesional.'}return {bi,focus,items,label:supplementFocusLabel(focus),note}}
function supplementPanel(c){const s=supplementAdvice(c);return `<div class="panel"><h2>Orientación para suplementación</h2><div class="field"><label>¿Qué foco principal quieres priorizar para la orientación de suplementación?</label><select data-field="supplementFocus"><option value="">Seleccionar foco principal</option>${supplementOptions.map(o=>`<option value="${o.id}" ${c.supplementFocus===o.id?'selected':''}>${esc(o.label)}</option>`).join('')}</select></div><p class="hint">La respuesta se utilizará para crear un apartado específico en el informe final con una propuesta orientativa de productos Gheos.</p>${c.supplementFocus?`<div class="stat-grid"><div class="stat"><b>Foco seleccionado</b>${esc(s.label)}</div><div class="stat"><b>Biotipo de referencia</b>${esc(bioName(s.bi)||'Sin definir')}</div></div>`:''}</div>`}
function renderSymptoms(c){const totals=energyScores(c);return `<div class="panel"><h2>Cuadro energético actual</h2><p class="muted">Independiente del biotipo constitucional. Señala intensidad: 0 ausente, 1 leve, 2 marcado. No se deduce la naturaleza energética de una enfermedad por su nombre.</p>${symptoms.map((s,i)=>`<div class="q-row"><div class="q-top"><div><div class="q-name">${esc(s.name)}</div><div class="q-desc">${esc(s.note)}</div></div><div class="choice-row">${[0,1,2].map(j=>`<label class="choice"><input type="radio" name="en-${i}" data-en="${i}" value="${j}" ${(c.energy[i]??0)==j?'checked':''}>${['Ausente','Leve','Marcado'][j]}</label>`).join('')}</div></div></div>`).join('')}</div><div class="panel"><h2>Orientación por ejes</h2><div class="stat-grid">${[['hot','Calor'],['cold','Frío'],['wet','Humedad'],['dry','Sequedad']].map(([k,v])=>`<div class="stat"><b>${v}: ${totals[k]}</b> Suma de signos declarados</div>`).join('')}</div><p class="hint">Resultado provisional: <b>${energyLabel(totals)}</b>. Los signos son inespecíficos. La fiebre, el edema, la taquicardia o los síntomas persistentes deben valorarse clínicamente y no servir como único criterio energético.</p></div>${supplementPanel(c)}${advance('duarte')}`;}
function dGroup(group,chosen,col){return Object.entries(group).map(([name,items])=>`<div class="d-group"><div class="d-group-head">${esc(name)}</div><div class="checks">${items.map((item)=>`<label class="check-item"><input type="checkbox" data-duarte="${col}" value="${esc(item)}" ${chosen.includes(item)?'checked':''}><span>${esc(item)}</span></label>`).join('')}</div></div>`).join('')}
function renderDuarte(c){const result=duarteResult(c);return `<div class="panel"><h2>Listas de síntomas azul y amarilla</h2><div class="hint">Selecciona los síntomas referidos por la persona.</div><div class="stat-grid"><div class="stat"><b style="color:#2a639c">AZUL · ${selectedItems(c,'blue').length}</b>${result.blue?'Supera umbral 4+':'Por debajo de 4'}</div><div class="stat"><b style="color:#9b7400">AMARILLA · ${selectedItems(c,'yellow').length}</b>${result.yellow?'Supera umbral 4+':'Por debajo de 4'}</div></div><div class="pill ${result.color==='VERDE'?'pill-green':result.color==='AZUL'?'pill-blue':result.color==='AMARILLO'?'pill-yellow':'pill-neutral'}" style="display:inline-block;margin-top:15px">Clasificación: ${result.color}</div></div><div class="grid-2"><div class="panel blue"><h2 style="color:#2866a0">Lista azul</h2>${dGroup(blueGroups,selectedItems(c,'blue'),'blue')}</div><div class="panel yellow"><h2 style="color:#9b7400">Lista amarilla</h2>${dGroup(yellowGroups,selectedItems(c,'yellow'),'yellow')}</div></div><div class="warning"><b>Sobre las pautas atribuidas a Duarte:</b> el apartado de resultados mostrará orientaciones para azul, amarillo o verde. La pauta del suero se ofrece como referencia documental para revisión profesional, no como prescripción automática.</div>${advance('report')}`;}
function morphScores(c){const scores=Object.fromEntries(Object.keys(profile).map(k=>[k,0]));let n=0;for(const q of morph){const ans=c.morph[q.id];if(ans&&scores[ans]!==undefined){scores[ans]+=q.weight;n++}}const ranking=Object.keys(scores).sort((a,b)=>scores[b]-scores[a]);let top=scores[ranking[0]]?ranking[0]:'';const second=scores[ranking[1]]&&scores[ranking[0]]-scores[ranking[1]]<=2?ranking[1]:'';const vals=BIO_ORDER.map(k=>scores[k]);const spread=Math.max(...vals)-Math.min(...vals);const possibleMuriatrico=n>=6 && spread<=3 && Math.max(...vals)>0;return {scores,n,top,second,possibleMuriatrico,spread};}
function energyScores(c){const out={hot:0,cold:0,wet:0,dry:0};symptoms.forEach((s,i)=>out[s.axis]+=Number(c.energy[i]||0));return out}
function energyType(s){const heat=Math.abs(s.hot-s.cold)>=2?(s.hot>s.cold?'C':'F'):'';const humid=Math.abs(s.wet-s.dry)>=2?(s.wet>s.dry?'H':'S'):'';return heat&&humid?heat+'-'+humid:''}
function energyLabel(s){const id=energyType(s);return id?`${kinds[id].name} (${id}); interpretación tradicional provisional`:'Indeterminado o mixto (faltan signos discriminantes)'}
function duarteResult(c){let blue=selectedItems(c,'blue').length>=4,yellow=selectedItems(c,'yellow').length>=4;return {blue,yellow,color:blue&&yellow?'VERDE':blue?'AZUL':yellow?'AMARILLO':'SIN PERFIL 4+'}}
function attitudePathology(c){const key=motivationAssessment(c).effective;return key&&BIO_CONTENT[key]?BIO_CONTENT[key].salud:'No determinada: completar el cuestionario de objetivos vitales y su valoración profesional.'}
function reportData(c){
 let m=morphScores(c),bi=c.manualBio||m.top,en=energyType(energyScores(c)),du=duarteResult(c),target=en||(c.state==='equilibrium'&&bi?profile[bi].energy:'');
 let fav=target?opposite[target]:'',mod=target;
 let why=en?'Se considera el patrón de signos actuales antes que el temperamento constitucional.':bi&&c.state==='equilibrium'?'Orientación general de mantenimiento a partir de la constitución, sin restricciones absolutas.':'Faltan datos suficientes para asociar una categoría energética concreta.';
 const mv=motivationAssessment(c);
 return {m,bi,en,du,fav,mod,why,motivation:mv.effective,motivationSource:mv.source,motivationSuggested:mv.suggested};
}

function silhouette(bio,gender,size=150){
 const widths={COLERICO:[22,20,15],SANGUINEO:[27,24,20],MELANCOLICO:[18,15,14],FLEMATICO:[30,29,26],MURIATRICO:[24,22,18]};
 const [shoulder,waist,hips]=widths[bio]||widths.MURIATRICO;
 const female=gender==='Mujer';
 const x1=75-shoulder,x2=75+shoulder,w1=75-waist,w2=75+waist,h1=75-(female?hips+6:hips),h2=75+(female?hips+6:hips);
 const stroke={COLERICO:'#c3872a',SANGUINEO:'#b96c53',MELANCOLICO:'#8b5a8e',FLEMATICO:'#566b56',MURIATRICO:'#4f9477'}[bio]||'#0a6232';
 const fill={COLERICO:'#f7efe2',SANGUINEO:'#faece7',MELANCOLICO:'#f3ecf5',FLEMATICO:'#f2f5ef',MURIATRICO:'#eaf5ef'}[bio]||'#eaf5ef';
 const chest = female ? `M61 88 C64 78 69 76 74 86 M76 86 C81 76 86 78 89 88` : `M63 84 L87 84 M61 95 L89 95`;
 const waistLine = female ? `M${w1+4} 112 Q75 126 ${w2-4} 112` : `M${w1+2} 114 L${w2-2} 114`;
 return `<svg viewBox="0 0 150 225" width="${size}" height="${Math.round(size*1.5)}" role="img" aria-label="Silueta didáctica ${esc(bioName(bio))}"><circle cx="75" cy="30" r="18" fill="white" stroke="${stroke}" stroke-width="2.2"/><ellipse cx="75" cy="110" rx="61" ry="96" fill="none" stroke="#dfe7e0" stroke-width="1.2"/><path d="M${x1} 65 Q75 57 ${x2} 65 L${w2} 116 L${h2} 150 L89 152 L86 210 L76 210 L75 158 L73 210 L63 210 L61 152 L${h1} 150 L${w1} 116 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.2"/><path d="M${x1} 67 L${x1-9} 112 L${x1-3} 142 M${x2} 67 L${x2+9} 112 L${x2+3} 142" stroke="${stroke}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="${chest}" stroke="${stroke}" stroke-width="1.2" fill="none" opacity=".6"/><path d="${waistLine}" stroke="${stroke}" stroke-width="1.1" fill="none" opacity=".55"/></svg>`;
}
function biotypeStrip(gender,selected){return `<div class="biotype-strip">${['FLEMATICO','COLERICO','MELANCOLICO','SANGUINEO','MURIATRICO'].map(k=>`<div class="biotype-card ${selected===k?'selected':''}">${silhouette(k,gender,72)}<b>${bioName(k)}</b></div>`).join('')}</div>`}
function chartBio(c){const m=morphScores(c),maxPossible=morph.reduce((t,q)=>t+q.weight,0);return `<div class="bio-graph">${BIO_ORDER.map(k=>{const val=m.scores[k],pct=Math.round(100*val/maxPossible);return `<div class="graph-row"><span>${bioName(k)}</span><div class="bar-base"><div style="width:${pct}%;background:${BIO_COLORS[k]}"></div></div><b>${val}/${maxPossible}</b></div>`}).join('')}<p class="fine">Puntos por coincidencia sobre un máximo teórico de ${maxPossible} (no son probabilidades). Muriátrico se valora aparte, por equilibrio general y confirmación profesional.</p></div>`;}
function chips(items,variant=''){return `<div class="food-chips">${(items||[]).map(x=>`<span class="food-chip ${variant==='moderate'?'moderate':''}">${esc(x)}</span>`).join('')}</div>`;}
function sueroReferenceHtml(){return `<div class="suero-reference"><h3>Fórmula del suero Duarte</h3><p><b>Componentes y cantidades:</b> AGUA 1,5 LITROS; UNA CUCHARADA DE POSTRE DE BICARBONATO; ir subiendo progresivamente hasta una cucharada de postre de SAL de calidad; ZUMO FILTRADO DE MEDIO LIMÓN.</p><p><b>Duración y consumo:</b> beberlo a lo largo del día según necesidad (sensación de sed), progresivamente se necesita beber menos hasta llegar a unos 250 ml al día. Hacerlo durante un mes.</p></div>`;}
function sueroReferenceText(){return `FÓRMULA DEL SUERO DUARTE
Componentes y cantidades: AGUA 1,5 LITROS; UNA CUCHARADA DE POSTRE DE BICARBONATO; ir subiendo progresivamente hasta una cucharada de postre de SAL de calidad; ZUMO FILTRADO DE MEDIO LIMÓN.
Duración y consumo: beberlo a lo largo del día según necesidad (sensación de sed), progresivamente se necesita beber menos hasta llegar a unos 250 ml al día. Hacerlo durante un mes.`;}
function duarteAdviceHtml(c,a){const blue=a.du.color==='AZUL'||a.du.color==='VERDE';const yellow=a.du.color==='AMARILLO'||a.du.color==='VERDE';const avoided=a.mod?kinds[a.mod]:null;const fav=a.fav?kinds[a.fav]:null;let out='';if(blue){out+=`<div class="advice-block advice-blue"><h3>Resultado azul: referencia sobre el suero</h3>${sueroReferenceHtml()}</div>`;}if(yellow){out+=`<div class="advice-block advice-yellow"><h3>Si el individuo sale amarillo</h3><p><b>Consejo de dieta antiinflamatoria orientativo</b>: evitar o moderar los alimentos desaconsejados por temperatura y humedad respecto a su caso particular, y priorizar las opciones más favorables dentro de una dieta adaptada.</p>${avoided?`<p><b>Alimentos a moderar según su caso (${avoided.name.toLowerCase()}):</b></p>${chips(avoided.food,'moderate')}`:''}${fav?`<p style="margin-top:10px"><b>Opciones a priorizar:</b></p>${chips(fav.food)}`:''}<p class="fine">Adaptar siempre a alergias, medicación, situación digestiva y criterio profesional.</p></div>`;}if(a.du.color==='VERDE'){out+=`<div class="advice-block advice-green"><h3>Si el individuo sale verde (azul + amarillo)</h3><p><b>RESULTADO VERDE:</b> seguir los consejos de la situación AZUL + los consejos de la situación AMARILLA.</p></div>`;}if(!out){out='<p class="fine">No se activa un consejo específico azul/amarillo porque no se ha superado el umbral configurado en las listas de Duarte.</p>';}return out}
function duarteAdviceText(c,a){const blue=a.du.color==='AZUL'||a.du.color==='VERDE';const yellow=a.du.color==='AMARILLO'||a.du.color==='VERDE';const avoided=a.mod?kinds[a.mod]:null;const fav=a.fav?kinds[a.fav]:null;let parts=[];if(blue)parts.push(sueroReferenceText());if(yellow)parts.push('RESULTADO AMARILLO: consejo de dieta antiinflamatoria evitando o moderando los alimentos desaconsejados por temperatura y humedad respecto a su caso particular.'+(avoided?` Moderar: ${avoided.food.join(', ')}.`:'')+(fav?` Priorizar: ${fav.food.join(', ')}.`:''));if(a.du.color==='VERDE')parts.push('RESULTADO VERDE: seguir los consejos de la situación AZUL + los consejos de la situación AMARILLA.');return parts.join('\n')||'Sin consejo específico azul/amarillo activado por las listas de Duarte.'}

function atlasCropClass(bio){return ({COLERICO:'colerico',SANGUINEO:'sanguineo',FLEMATICO:'flematico',MELANCOLICO:'melancolico',MURIATRICO:'muriatrico'})[bio]||'muriatrico'}
function atlasFigure(bio){if(bio==='MURIATRICO')return `<div class="atlas-card atlas-card-muriatrico">${silhouette('MURIATRICO','',140)}<b>Muriátrico</b><small>Normotipo / perfil equilibrado</small></div>`;return `<div class="atlas-card"><div class="atlas-crop atlas-${atlasCropClass(bio)}" aria-hidden="true"></div><b>${bioName(bio)}</b><small>Representación visual tipo atlas</small></div>`}
function atlasPanel(selected){return `<div class="atlas-panel"><h3>Atlas orientativo de los cuatro biotipos principales</h3><img src="./atlas-biotipos.png" alt="Atlas de los cuatro biotipos principales"><p class="fine">Lámina visual general al inicio del informe. A continuación se muestra el biotipo correspondiente a la persona evaluada.</p></div>`}
function visualSummary(c){const d=reportData(c),bi=d.bi||'MURIATRICO',content=BIO_CONTENT[bi];return `<section class="visual-summary"><div class="visual-head"><img src="./logo-gheos.png" alt="Gheos Proyecto Natural"/><div><h2>Informe de evaluación biotipológica</h2><p>${esc(c.name+' '+c.surnames)} · ${new Date().toLocaleDateString('es-ES')}</p></div></div>${atlasPanel(bi)}<div class="visual-body"><div class="silhouette-box">${atlasFigure(bi)}<small>${c.manualBio?'Confirmado por el profesional':'Orientativo sin confirmar'}</small></div><div>${chartBio(c)}${d.m.possibleMuriatrico?'<p class="hint">Distribución equilibrada: considerar valoración muriátrica, no automática.</p>':''}</div></div><div class="interpret-box"><h3>Constitución y objetivos vitales</h3><div class="vital-compare"><div><small>Biotipo constitucional</small><b>${esc(d.bi?bioName(d.bi):'No determinado')}</b><span>${esc(d.bi?`${BIO_CONTENT[d.bi]?.elemento||''} · ${BIO_CONTENT[d.bi]?.naturaleza||''}`:'')}</span></div><div><small>Perfil de motivación dominante</small><b>${esc(d.motivation?bioName(d.motivation):'No determinado')}</b><span>${esc(d.motivation?`${BIO_CONTENT[d.motivation]?.elemento||''} · ${BIO_CONTENT[d.motivation]?.naturaleza||''}`:'')}</span></div></div><p class="vital-interpretation">${esc(vitalDifference(c,d))}</p><h3>Intereses vitales del biotipo constitucional</h3><p>${esc(d.bi?BIO_CONTENT[d.bi]?.interes:'No determinados')}</p><h3>Motivación personal dominante</h3><p>${esc(d.motivation?BIO_CONTENT[d.motivation]?.interes:'No determinada')}</p><h3>Desequilibrios tradicionalmente asociados a la motivación dominante</h3><p>${esc(attitudePathology(c))}</p><p class="fine">Estas asociaciones son una reflexión basada en los conocimientos sobre biotipologías, no una predicción de enfermedad ni una relación causal demostrada.</p>${c.photoReviewApplied?.count?`<div class="photo-report-note"><b>Revisión fotográfica:</b> ${c.photoReviewApplied.count} rasgos contrastados por el terapeuta e incorporados a la evaluación morfológica.</div>`:''}</div></section>`;}
function renderReport(c){let a=reportData(c),p=a.bi?profile[a.bi]:null;const content=a.bi?BIO_CONTENT[a.bi]:null;const target=a.fav?kinds[a.fav]:null,avoided=a.mod?kinds[a.mod]:null;return `<div class="panel">${visualSummary(c)}</div><div class="panel"><h2>Resumen individual</h2><div class="results-main"><div class="result-card"><small>Constitución</small><strong>${esc(bioName(a.bi))}</strong><p class="muted">${p?`${p.alias} · ${p.nature} (${p.energy})`:'Completar la evaluación'}</p><p class="fine">${c.manualBio?'Biotipo confirmado por profesional.':a.bi?'Sugerencia morfológica sin confirmar.':'No se dispone de evaluación suficiente.'}</p>${a.m.second?`<small>Coincidencias secundarias: ${bioName(a.m.second)}</small>`:''}</div><div class="result-card"><small>Motivación personal</small><strong style="font-size:17px">${a.motivation?bioName(a.motivation):'No registrada'}</strong><p class="muted">${a.motivation?BIO_CONTENT[a.motivation].interes:'Completar los objetivos vitales en Morfología.'}</p></div><div class="result-card"><small>Cuadro de síntomas actual</small><strong style="font-size:17px">${a.en?kinds[a.en].name:'Indeterminado'}</strong><p class="muted">${a.en||'No clasificado'} · ${esc(c.state==='equilibrium'?'Mantenimiento declarado':'Se refieren síntomas')}</p><p class="fine">Clasificación tradicional basada en preguntas, no diagnóstico médico.</p></div><div class="result-card"><small>Listas azul / amarilla</small><strong>${a.du.color}</strong><p class="muted">Azul ${selectedItems(c,'blue').length} / Amarilla ${selectedItems(c,'yellow').length}</p><p class="fine">Umbral de 4 heredado de la versión anterior, no indicado en el nuevo PDF.</p></div></div></div><div class="panel"><h2>Selección alimentaria tradicional, explicada</h2><p>${esc(a.why)}</p>${target?`<h3>Alimentos a potenciar como opciones, naturaleza ${target.name.toLowerCase()} (${a.fav})</h3>${chips(target.food)}<p class="fine">Por su naturaleza opuesta a ${a.en?'los signos energéticos identificados':`la constitución ${p?.nature||'no determinada'}`}. Se proponen como opciones dentro de una dieta completa y adaptada, no como obligación diaria.</p>`:'<p class="warning">No se propone una lista personalizada de alimentos hasta completar o confirmar el perfil energético.</p>'}${avoided?`<h3>Alimentos tradicionalmente a moderar, naturaleza ${avoided.name.toLowerCase()} (${a.mod})</h3>${chips(avoided.food,'moderate')}<p class="fine">«Moderar» no significa excluir; la cantidad, tolerancia, alergias, tratamientos y requisitos nutricionales prevalecen.</p>`:''}</div><div class="panel"><h2>Consejos según las listas azul / amarilla</h2>${duarteAdviceHtml(c,a)}</div><div class="panel"><h2>Orientación de suplementación</h2>${(()=>{const s=supplementAdvice(c);return s.focus?`<p><b>Foco principal declarado:</b> ${esc(s.label)}</p><p><b>Biotipo constitucional de referencia:</b> ${esc(bioName(s.bi)||'No definido')}</p>${s.items.length?`<p><b>Productos Gheos a considerar:</b></p>${productChips(s.items)}`:'<p>No hay una pauta automática definida para esta combinación; valorar individualmente.</p>'}<p class="fine">${esc(s.note)} La selección debe revisarla el profesional considerando antecedentes, tratamientos y posibles contraindicaciones.</p>`:'<p>No se ha indicado todavía una necesidad principal en el cuestionario.</p>'})()}</div><div class="panel"><h2>Hábitos de vida</h2><ul class="report-list">${(p?p.habits:[]).map(x=>`<li>${esc(x)}</li>`).join('')}<li>Regularidad del sueño y comidas.</li><li>Hidratación según sed.</li><li>Movimiento adaptado a la edad, la capacidad y el estado de salud.</li></ul>${c.allergies?`<p><b>Alergias/intolerancias declaradas:</b> ${esc(c.allergies)}. Revisar individualmente cualquier alimento propuesto.</p>`:''}${c.medicine?`<p><b>Precauciones clínicas declaradas:</b> ${esc(c.medicine)}. Consultar con profesional sanitario antes de cambios que puedan afectar al tratamiento.</p>`:''}<p class="fine">Estas propuestas son didácticas, no una dieta calculada por requerimientos energéticos, ni una prescripción para problemas médicos.</p></div><div class="panel"><div class="steps"><button class="secondary" data-next="duarte">← Revisar respuestas</button></div><h2>Informe y comunicación</h2><p class="muted">Antes de abrir el correo se solicitará consentimiento para compartir el informe. El correo se redacta en tu aplicación de correo y <b>no se envía automáticamente</b>.</p><div class="toolbar"><button id="print-report" class="primary">Imprimir / guardar PDF</button><button id="export-text" class="secondary">Descargar resumen TXT</button><button id="email-report" class="secondary">Preparar correo (pedir permiso)</button></div><p class="fine">La aplicación de correo no adjunta por sí sola el PDF. Guárdalo e incorpóralo manualmente si quieres enviar el informe completo.</p></div><div class="print-area" id="print-report-data"></div>`}
function reportText(c){const d=reportData(c),p=d.bi?profile[d.bi]:null;const content=d.bi?BIO_CONTENT[d.bi]:null;const f=d.fav?kinds[d.fav]:null,m=d.mod?kinds[d.mod]:null;return `INFORME ORIENTATIVO · TEST BIOTIPOLOGÍAS GHEOS
Fecha: ${new Date().toLocaleDateString('es-ES')}
Nombre: ${c.name} ${c.surnames}
Edad: ${c.age||'No indicada'} · Género: ${c.gender||'No indicado'}
Contacto: ${c.phone||'—'} · ${c.email||'—'}
Motivo de consulta: ${c.health||'No indicado'}

CONSTITUCIÓN
${d.bi?`${bioName(d.bi)} (${p.alias}), ${p.nature} (${p.energy})`:'No determinada'} · ${c.manualBio?'Confirmada por profesional':'Sugerencia provisional sin confirmar'}
${p?.intro||''}

REVISIÓN FOTOGRÁFICA
${c.photoReviewApplied?.count?c.photoReviewApplied.count+' rasgos morfológicos confirmados desde fotografías por el terapeuta.':'Sin revisión fotográfica confirmada.'}

MOTIVACIÓN PERSONAL Y OBJETIVOS VITALES
Biotipo constitucional: ${d.bi?bioName(d.bi):'No determinado'}${d.bi?` (${BIO_CONTENT[d.bi].elemento}, ${BIO_CONTENT[d.bi].naturaleza})`:''}
Perfil de motivación dominante: ${d.motivation?bioName(d.motivation):'No determinado'}${d.motivation?` (${BIO_CONTENT[d.motivation].elemento}, ${BIO_CONTENT[d.motivation].naturaleza})`:''}
Origen de la valoración de motivación: ${d.motivationSource}
Comparación: ${vitalDifference(c,d)}
Intereses vitales constitucionales: ${d.bi?BIO_CONTENT[d.bi].interes:'No determinados'}
Objetivos vitales dominantes: ${d.motivation?BIO_CONTENT[d.motivation].interes:'No determinados'}
Desequilibrios tradicionalmente asociados al perfil motivacional: ${attitudePathology(c)}
Estas asociaciones son una reflexión basada en los conocimientos sobre biotipologías, no una predicción de enfermedad ni una relación causal demostrada.

CUADRO ENERGÉTICO ACTUAL
${d.en?`${kinds[d.en].name} (${d.en})`:'Indeterminado'}
Signos declarados: ${symptoms.filter((_,i)=>Number(c.energy[i]||0)>0).map((s)=>s.name).join('; ')||'Ninguno registrado'}

CUESTIONARIOS DAVID DUARTE
Azul: ${selectedItems(c,'blue').length}, amarillo: ${selectedItems(c,'yellow').length}, resultado: ${d.du.color}. Clasificación orientativa con umbral heredado de la PWA anterior.
Síntomas azules: ${selectedItems(c,'blue').join('; ')||'Ninguno'}
Síntomas amarillos: ${selectedItems(c,'yellow').join('; ')||'Ninguno'}
${duarteAdviceText(c,d)}

ALIMENTACIÓN TRADICIONAL
${d.why}
${f?'Opciones a potenciar ('+d.fav+'): '+f.food.join(', '):'Sin alimentos asignados'}
${m?'Opciones a moderar sin excluir ('+d.mod+'): '+m.food.join(', '):''}

ORIENTACIÓN DE SUPLEMENTACIÓN
${(()=>{const s=supplementAdvice(c);return s.focus?`Foco principal declarado: ${s.label}
Biotipo constitucional de referencia: ${bioName(s.bi)||'No definido'}
${s.items.length?'Productos Gheos a considerar: '+s.items.join(', '):'No hay una pauta automática definida para esta combinación; valorar individualmente.'}
${s.note}
La selección debe revisarla el profesional considerando antecedentes, tratamientos y posibles contraindicaciones.`:'No se ha indicado todavía una necesidad principal en el cuestionario.'})()}

HÁBITOS
${(p?.habits||[]).map(x=>'- '+x).join('\n')}
- Regularidad del sueño y comidas.
- Actividad física adaptada.
- Hidratación según sed.

ALERGIAS Y PRECAUCIONES
${c.allergies||'No declaradas'}
${c.medicine||''}

REFERENCIAS
La información para elaborar este informe ha sido extraída de la documentación compartida en el curso "Biotipologías en clave Moderna" realizado en Gheos Proyecto Natural SL en el mes de noviembre de 2026 por Jesús Domínguez. En el curso se citan diferentes fuentes consultadas.
Estas clasificaciones tradicionales son orientativas y no constituyen diagnóstico ni tratamiento.
`;}
function bindControls(){document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{activeSet(b.dataset.screen);window.scrollTo({top:0,behavior:'instant'});});const c=current();document.querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>{try{activeSet(b.dataset.next);window.scrollTo({top:0,behavior:'instant'});}catch(err){console.error('Error de navegación',err);notice('No se pudo abrir esa sección. Recarga la aplicación e inténtalo de nuevo.');}});if(screen==='cases'){
 $('#new-case').onclick=async()=>{let c=fresh();vault.cases[c.id]=c;vault.active=c.id;await persist();activeSet('identity');notice('Nuevo caso creado')};
 $('#export-data').onclick=()=>{const packet={version:7,format:'biotipologias-gheos-json',cases:vault.cases,active:vault.active,updated:new Date().toISOString()};download(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'}),'biotipologias-gheos-copia-sin-cifrar-'+new Date().toISOString().slice(0,10)+'.json');notice('Copia exportada sin contraseña y sin cifrado. Guárdala en un lugar seguro.')};
 async function recoverPacket(p){let doc;if(p.salt&&p.iv&&p.data){if(!crypto?.subtle)throw Error('Para importar un respaldo antiguo cifrado, abre la PWA mediante HTTPS o localhost.');const pass=prompt('Contraseña del archivo cifrado anterior (solo para recuperar sus casos):');if(!pass)return false;const k=await derive(pass,fromB64(p.salt));const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(p.iv)},k,fromB64(p.data));doc=JSON.parse(dec(plaintext));}else if(p.cases&&typeof p.cases==='object'){doc=p;}else throw Error('Formato de copia no reconocido');if(!doc.cases||typeof doc.cases!=='object'||Array.isArray(doc.cases))throw Error('Copia no válida');const count=Object.keys(doc.cases).length;if(!confirm(`Importar ${count} casos al archivo local sin cifrar? Los casos con el mismo identificador se sustituirán. Los datos quedarán accesibles sin contraseña en este navegador.`))return false;Object.assign(vault.cases,doc.cases);await persist();render();notice(`${count} casos importados al archivo local`);return true;}
 $('#import-data').onchange=async e=>{let f=e.target.files?.[0];if(!f)return;try{await recoverPacket(JSON.parse(await f.text()))}catch(err){alert('No se pudo importar: '+err.message)}finally{e.target.value=''}};

 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=async()=>{vault.active=b.dataset.open;await persist();activeSet('identity')});document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar permanentemente este caso y sus fotografías?'))return;delete vault.cases[b.dataset.delete];if(vault.active===b.dataset.delete)vault.active=null;await persist();render()});return;}
 if(!c)return;
 document.querySelectorAll('[data-field]').forEach(x=>x.addEventListener('change',async()=>{await update(c=>{c[x.dataset.field]=x.value});if(['manualBio','state','motivationBio'].includes(x.dataset.field))render();else notice('Guardado local');}));
 document.querySelectorAll('[data-morph]').forEach(x=>x.onchange=async()=>{await update(c=>c.morph[x.dataset.morph]=x.value);render()});
 document.querySelectorAll('[data-motivation-score]').forEach(x=>x.onchange=async()=>{await update(c=>{c.motivationScores??={};if(x.value==='')delete c.motivationScores[x.dataset.motivationScore];else c.motivationScores[x.dataset.motivationScore]=Number(x.value)});render()});
 document.querySelectorAll('[data-en]').forEach(x=>x.onchange=async()=>{await update(c=>c.energy[x.dataset.en]=Number(x.value));render()});
 document.querySelectorAll('[data-duarte]').forEach(x=>x.onchange=async()=>{await update(c=>{const col=x.dataset.duarte;const s=new Set(selectedItems(c,col));x.checked?s.add(x.value):s.delete(x.value);c[col]=[...s]});render()});
 if(screen==='photos'){
 const btn=$('#analyze-full-photo');if(btn)btn.onclick=async()=>{btn.disabled=true;btn.textContent='Analizando imagen…';try{const a=await analyzeFullPhoto(c.photos.full);await update(x=>x.photoAnalysis=a);render();}catch(e){console.error(e);notice('No se pudo analizar la fotografía. Revisa el formato y vuelve a intentarlo.');btn.disabled=false;btn.textContent='Analizar proporciones de la foto';}};
 const clear=$('#clear-photo-analysis');if(clear)clear.onclick=async()=>{await update(x=>x.photoAnalysis=null);render()};

 document.querySelectorAll('[data-photo-review]').forEach(sel=>sel.onchange=async()=>{await update(x=>{x.photoReview??={};x.photoReview[sel.dataset.photoReview]=sel.value;});render();});
 const applyReview=$('#apply-photo-review');if(applyReview)applyReview.onclick=async()=>{const r=photoReviewScore(c);await update(x=>{for(const [id] of PHOTO_REVIEW_FIELDS){const src=PHOTO_REVIEW_FIELDS.find(f=>f[0]===id)?.[2];if(x.photoReview?.[id]&&x.photos?.[src])x.morph[id]=x.photoReview[id];}x.photoReviewApplied={at:new Date().toISOString(),count:r.answered};});render();notice(`${r.answered} observaciones fotográficas confirmadas en Morfología.`);};
 const cleanReview=$('#clear-photo-review');if(cleanReview)cleanReview.onclick=async()=>{await update(x=>{x.photoReview={};x.photoReviewApplied=null;});render();};


 }
 if(screen==='photos'){const consent=$('#photo-consent');if(consent)consent.onchange=async()=>{await update(c=>c.photoConsent=consent.checked);render()};}document.querySelectorAll('[data-photo]').forEach(x=>{x.disabled=!c.photoConsent;x.onchange=async()=>{const file=x.files?.[0];if(!file)return;try{const data=await scaleImage(file);await update(c=>(c.photos[x.dataset.photo]=data,(x.dataset.photo==='full'&&(c.photoAnalysis=null),c.photoReview={...c.photoReview},x.dataset.photo==='face'&&(delete c.photoReview.face),x.dataset.photo==='hands'&&(delete c.photoReview.hands),x.dataset.photo==='full'&&(['body','shoulders','veins'].forEach(id=>delete c.photoReview[id])),c.photoReviewApplied=null)));render();notice('Fotografía guardada')}catch(err){alert('No se pudo guardar la foto: '+err.message)}}});
 document.querySelectorAll('[data-remove-photo]').forEach(x=>x.onclick=async()=>{if(!confirm('¿Eliminar esta fotografía del caso?'))return;await update(c=>(delete c.photos[x.dataset.removePhoto],(x.dataset.removePhoto==='full'&&(c.photoAnalysis=null),c.photoReview={...c.photoReview},x.dataset.removePhoto==='face'&&(delete c.photoReview.face),x.dataset.removePhoto==='hands'&&(delete c.photoReview.hands),x.dataset.removePhoto==='full'&&(['body','shoulders','veins'].forEach(id=>delete c.photoReview[id])),c.photoReviewApplied=null)));render()});
 $('#save-case').onclick=async()=>{await persist();notice('Ficha guardada en este dispositivo')};
 if(screen==='report'){
 $('#print-report').onclick=()=>{const d=$('#print-report-data');d.innerHTML=`${visualSummary(c)}${reportText(c).split('\n\n').map(x=>`<section><p>${esc(x).replaceAll('\n','<br>')}</p></section>`).join('')}`;window.print()};
 $('#export-text').onclick=()=>download(new Blob([reportText(c)],{type:'text/plain;charset=utf-8'}),'informe-biotipologias-gheos-'+safeName(c.name+'-'+c.surnames)+'.txt');
 $('#email-report').onclick=()=>showConsent(c);
 }
}
function safeName(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'-')}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000)}
function scaleImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(Error('Archivo no válido'));if(file.size>25e6)return reject(Error('Imagen demasiado grande'));const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{let ratio=Math.min(1,1400/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*ratio);canvas.height=Math.round(img.height*ratio);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',0.78))};img.onerror=()=>reject(Error('Formato de imagen no compatible'));img.src=r.result};r.onerror=()=>reject(r.error);r.readAsDataURL(file)})}
function showConsent(c){const modal=$('#modal-root');const checktext='Confirmo que la persona ha autorizado el envío de este informe a su correo electrónico y que he revisado el contenido.';modal.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="Autorizar correo"><h2>Confirmar envío de informe</h2><p>Destinatario propuesto: <b>${esc(c.email||'No consta correo electrónico')}</b>.</p><p>La aplicación <b>abrirá un borrador</b> en tu gestor de correo. No enviará nada automáticamente ni adjuntará el PDF: deberás adjuntarlo manualmente si quieres remitir el informe completo.</p><label class="check-item"><input id="mail-consent" type="checkbox"><span>${esc(checktext)}</span></label><div class="row"><button type="button" class="secondary" id="mail-cancel">Cancelar</button><button type="button" class="primary" id="mail-confirm" disabled>Preparar correo</button></div></div>`;modal.classList.remove('hidden');const close=()=>{modal.classList.add('hidden');modal.innerHTML=''};$('#mail-cancel').onclick=close;$('#mail-consent').onchange=e=>$('#mail-confirm').disabled=!e.target.checked||!c.email;$('#mail-confirm').onclick=async()=>{const d=reportData(c);let text=`Hola,\n\nTe comparto un resumen orientativo de la evaluación de biotipología tradicional.\n\nBiotipo: ${bioName(d.bi)}${c.manualBio?' (confirmado por profesional)':' (provisional)'}.\nCuadro energético: ${d.en||'No determinado'}.\nCuestionarios de Duarte: ${d.du.color} (azul: ${selectedItems(c,'blue').length}, amarillo: ${selectedItems(c,'yellow').length}).\n\nEl informe completo puede adjuntarse como PDF tras su revisión. Estos perfiles no son diagnósticos médicos ni sustituyen una valoración clínica.\n\nUn saludo.`; await update(c=>c.consents.push({at:new Date().toISOString(),action:'correo_preparado_con_declaracion_de_consentimiento',email:c.email}));const url=`mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent('Informe orientativo Biotipologías Gheos - '+c.name+' '+c.surnames)}&body=${encodeURIComponent(text)}`;close();location.href=url;notice('Se abrió un borrador de correo. Revisa el destinatario y el contenido antes de enviarlo.')};}
async function boot(){
 serverLocal=location.protocol==='https:'||location.hostname==='localhost';
 try{
  const data=await getRaw('open-v06');
  vault={cases:data?.cases&&typeof data.cases==='object'?data.cases:{},active:data?.active||null};
  $('#unlock-view').classList.add('hidden');
  $('#app-view').classList.remove('hidden');
  activeSet('cases');
  if('serviceWorker'in navigator&&serverLocal){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
 }catch(err){
  $('#unlock-view').classList.remove('hidden');
  $('#app-view').classList.add('hidden');
  $('#vault-error').textContent='Error al iniciar: '+err.message;
 }
}
boot();