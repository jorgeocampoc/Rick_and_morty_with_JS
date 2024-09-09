import { getApiData } from "../utilities/GetApiData.mjs";
let page = 1;
const pageCh1 = document.getElementById('pg1')
pageCh1.disabled = true
const pageCh2 = document.getElementById('pg2')
const pageCh3 = document.getElementById('pg3')
let pages = '';
const buttonNext = document.getElementById('next');
const buttonPrev = document.getElementById('prev');
const finalPage = document.getElementById('pageFinal');
let tipo = 'character';
let currentNav = 1;
const divCards = document.getElementById('cards');
const imgNav = document.getElementById('img-nav');
let value = '';
const inputFocus = document.getElementById('input-form');
var band = false;

async function processData(page, tipo, data) {
  try {
    const {characters, info} = await getApiData(page, tipo, data);
    changePage(page);
    pages = info.pages;
    if( tipo === 'character' ){
      if( characters.length !== 0 ){
        characters.forEach( ch => {
          const { name, status, image, gender, origin, species, img } = ch;
          createCard( name, status, image, gender, origin, species, img );
          offLoading();
          buttonNext.disabled = false;
          buttonPrev.disabled = false;

    
      });
      }else{
        createMessageError();
        inputFocus.focus();
        inputFocus.select();
      }
   }else if( tipo === 'episode'){
      characters.forEach( ch => {
      currentNav = 2
      changePage(page);
      const {  id, name, episode, air_date } = ch;
      createdCardChapter(  id, name, episode, air_date );
      buttonNext.disabled = false;
      buttonPrev.disabled = false;

  });

   }else{
      
   }
    offLoading();
    finalPage.textContent = info.pages;
    band = true;
  } catch (error) {
    console.log(error);
  }
}
activarButton(1)
 
var dataValue = '';


document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  if (data.name.trim() !== '') { // Verifica si se ingresó un valor no vacío
    dataValue = data.name;
    value = 'name=' + data.name;
    currentNav = 1;
    page = 1;
    tipo = 'character';
    removeListCharacters();
    onLoading();
    processData(page, tipo, value);
    pageCh1.disabled = false;
    pageCh2.disabled = false;
    if (page < pages) {
    buttonNext.disabled = false; 
    }
  } else {
    alert('Por favor, ingresa un nombre de un personaje');
    inputFocus.focus();
  }

});


processData(page, tipo, currentNav);

imgNav.addEventListener('click', (event)=> {
  event.preventDefault();
})

function onLoading(){
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
}

function offLoading(){
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
}

const removeListCharacters = () =>{
    const divCards = document.getElementById('cards');
    while (divCards.firstChild) {
        divCards.removeChild(divCards.firstChild)
    }
}

pageCh1.addEventListener('click', (event) => {
  event.preventDefault();
  currentNav = 1;
  page = 1;
  tipo = 'character'; 
  value = ''; 
  removeListCharacters();
  onLoading();
  processData(page, tipo, value);
  activarButton(1);
  buttonPrev.disabled = true; 
  if (page < pages) {
    buttonNext.disabled = false; 
  }
});

pageCh2.addEventListener('click', (event) => {
  event.preventDefault();
  currentNav = 2;
  page = 1;
  tipo = 'episode';
  value = '';
  removeListCharacters();
  onLoading();
  processData(page, tipo, value);
  activarButton(2);
  buttonPrev.disabled = true; 
  if (page < pages) {
    buttonNext.disabled = false; 
  }
});

function createMessageError(){

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert   h-100 w-50 ";
  alertDiv.setAttribute("role", "alert");

  const alertHeading = document.createElement("h4");
  alertHeading.className = "alert-heading text-center";
  alertHeading.textContent = "Personaje no encontrado";

  const hr = document.createElement("hr");

  const secondParagraph = document.createElement('p');
  secondParagraph.className = 'mb-0 text-center fs-5';
  secondParagraph.textContent = `No se pudo encontrar un personaje con el nombre de `;

  const labelValue = document.createElement('label');
  labelValue.style.color = 'black'
  labelValue.style.fontWeight = 'bold'
  labelValue.style.color = 'white'
  labelValue.textContent = inputFocus.value;

  secondParagraph.appendChild(labelValue)

  alertDiv.appendChild(alertHeading);
  alertDiv.appendChild(hr);
  alertDiv.appendChild(secondParagraph)

  

  divCards.appendChild(alertDiv);
}

function cleanName(name){
  let res = '';
    for (let index = name.length-1; index <=0 ; index--) {
        if( name.charAt(index) === '=' ){
          break;
        }else{
          res = res + name.charAt(index)
        }
    }
    console.log('ffffffffffffffffffffffffff',res);
    return res;
}

function createdCardChapter( id, name, episode, air_date ){

  const {s,e} = convertEpisode(episode);
  const columnaChapter = document.createElement('div');
  columnaChapter.className = 'col-12 col-sm-12 col-md-6 col-lg-6   col-xl-4 col-xxl-3    mb-3';

  const card = document.createElement('div');
  card.className = 'card  bg-dark    rounded  mb-2 mt-2  border-top-white w-100 border-top  cardStyle';
  card.style.width = '18rem';

  const numChaper = document.createElement('p')
  numChaper.className = 'card-text m-3 fs-5 text-md text-center';
  // numChaper.textContent = id;
  numChaper.textContent = name;
  
  const linea = document.createElement('hr');
  linea.className = 'm-0 p-0'

  const titleCard = document.createElement('p')
  titleCard.className = 'card-text ms-3 fs-5 text-md mt-2';
  titleCard.textContent = 'Temporada: '+ s ;

  const episodeCard = document.createElement('p')
  episodeCard.className = 'card-text ms-3 fs-5 text-md';
  episodeCard.textContent =  'Capitulo: '+e ;

  const dateCard = document.createElement('p')
  dateCard.className = 'card-text ms-3  mb-3  ';
  dateCard.textContent = 'Fecha de estreno: '+ air_date ;

  card.appendChild(numChaper);
  card.appendChild(linea)
  card.appendChild(titleCard);
  card.appendChild(episodeCard);
  card.appendChild(dateCard);

  columnaChapter.appendChild(card)
  divCards.appendChild(columnaChapter)

}

function convertEpisode(episode){
  let s = episode.substring(1,3);
  let e = episode.substring(4,6);
  return {s,e};
}

function createCard ( name, status, image, gender, origin, species, img ){

  ( gender === 'Male' )? gender = 'Masculino':gender = 'Femenino';
  const columna = document.createElement('div');
  columna.className = 'col-12 col-sm-12 col-md-5 col-lg-5   col-xl-3 col-xxl-3  col-custom   cardStyle bg-dark border-top  border-white  border-bottom container-fluid ';

  const card = document.createElement('div');
  card.className = 'card  bg-dark  rounded  m-auto  p-4   ';
  card.style.width = '18rem';

  const imagen = document.createElement('img');
  imagen.className = 'card-img-top rounded-circle img-fluid mb-3 colorIamge w-100 '
  imagen.src = image;
  imagen.border = '5px';
  imagen.width = '500px';
  imagen.height = 'auto';
  imagen.alt = 'Card not found';

  const body = document.createElement('div');
  const nameCard = document.createElement('p');
  nameCard.className = 'card-text';
  nameCard.style.color = 'white';
  nameCard.style.textAlign = 'center';
  nameCard.style.textTransform = 'uppercase';
  nameCard.style.fontWeight = 'bold';
  nameCard.textContent = name;

  const statusCard = document.createElement('p');
  const icon = document.createElement('i');
 
  statusCard.className = 'card-text';
  if( status === 'Alive'  ){ icon.className = 'bi bi-circle bg-success rounded-circle ms-2 ' }
  else if ( status === 'Dead' ) { icon.className = 'bi bi-circle bg-dark rounded-circle ms-2' }
  else if ( status === 'unknown')  {icon.className = 'bi bi-circle bg-secondary rounded-circle ms-2'}
  statusCard.style.color = 'white'; 
  statusCard.textContent = 'Status: '+ status ;
  statusCard.appendChild(icon)

  const genderCard = document.createElement('p');
  genderCard.className = 'card-text';
  genderCard.style.color = 'white';
  genderCard.textContent = 'Genero: '+gender

  const speciesCard = document.createElement('p')
  speciesCard.className = 'card-text';
  speciesCard.style.color = 'white';
  speciesCard.textContent = 'Especie: '+species;

  body.appendChild(nameCard);
  body.appendChild(statusCard);
  body.appendChild(speciesCard);
  body.appendChild(genderCard);
  card.appendChild(imagen)
  card.appendChild(body)

  columna.appendChild(card);
  divCards.appendChild(columna)

}


buttonNext.addEventListener('click', () => {
  if( page < pages ){
    onLoading()
    page++;
    buttonNext.disabled = false;
    buttonPrev.disabled = false;
    removeListCharacters();
    changePage(page)
    processData(page, tipo, value);
    buttonNext.disabled = true;
    buttonPrev.disabled = true;

  }else{
    buttonPrev.disabled = false;
    buttonNext.disabled = true;

  }
  
})

buttonPrev.addEventListener('click',()=>{
  if( page > 1){
    onLoading()
    buttonPrev.disabled = false;
    buttonNext.disabled = false
    page--;
    removeListCharacters();
    changePage(page)
    processData(page, tipo, value)
    buttonNext.disabled = true;
    buttonPrev.disabled = true;
  }else{
    buttonPrev.disabled = true;
  }
})



function changePage(page){
  const current = document.getElementById('pageCurrent');
  current.textContent = page;
  const finalPage = document.getElementById('pageFinal');
  finalPage.textContent = pages;

}



function activarButton(nav){
  if( nav === 2 ){
    pageCh2.disabled = true;
  pageCh1.disabled = false;
  pageCh3.style.textDecoration = 'none';   
  pageCh2.style.textDecoration = 'underline';   
  pageCh1.style.textDecoration = 'none'; 
  pageCh3.disabled = false;
  }  else if( nav === 1 ){
    pageCh3.style.textDecoration = 'none';   
    pageCh2.style.textDecoration = 'none';   
    pageCh1.style.textDecoration = 'underline'; 
    pageCh2.disabled = false;
  pageCh1.disabled = true;
  pageCh3.disabled = false;
}else{
  pageCh3.style.textDecoration = 'underline';   
    pageCh2.style.textDecoration = 'none';   
    pageCh1.style.textDecoration = 'none'; 
  pageCh2.disabled = false;
  pageCh1.disabled = false;
  pageCh3.disabled = true;
}
}