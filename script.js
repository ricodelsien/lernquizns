let personenDaten = [];

async function ladeDaten() {
  const response = await fetch('personen.csv');
  const data = await response.text();
  const rows = data.trim().split('\n').slice(1);
  
  personenDaten = rows.map(row => {
    const [bild, name, position] = row.split(';');
    return { bild, name, position };
  });
  
  initQuiz(personenDaten);
}

function initQuiz(personenDaten) {
  const imagesRow = document.getElementById('imagesRow');
  const namesRow = document.getElementById('namesRow');
  const positionsRow = document.getElementById('positionsRow');

  imagesRow.innerHTML = '';
  namesRow.innerHTML = '';
  positionsRow.innerHTML = '';

  const bilderOptionen = shuffle(personenDaten.map(p => p.bild));
  const namenOptionen = shuffle(personenDaten.map(p => p.name));
  const positionenOptionen = shuffle(personenDaten.map(p => p.position));

  createSelection(imagesRow, bilderOptionen, 'Bild', 'selectedImage');
  createSelection(namesRow, namenOptionen, 'Name', 'selectedName');
  createSelection(positionsRow, positionenOptionen, 'Position', 'selectedPosition');
}

function createSelection(container, options, label, selectionVar) {
  options.forEach(option => {
    const optionElem = document.createElement('div');
    optionElem.className = `option-item ${label.toLowerCase()}`;
    optionElem.textContent = label === 'Bild' ? '' : option;
    if (label === 'Bild') optionElem.style.backgroundImage = `url(${option})`;

    // Klick-Event für Auswahl
    optionElem.addEventListener('click', () => {
      optionElem.classList.toggle('selected');
      window[selectionVar] = optionElem.classList.contains('selected') ? option : null;
      checkAnswer();
    });
    
    container.appendChild(optionElem);
  });
}

function checkAnswer() {
  const selectedImage = window.selectedImage;
  const selectedName = window.selectedName;
  const selectedPosition = window.selectedPosition;

  if (selectedImage && selectedName && selectedPosition) {
    const match = personenDaten.find(person => 
      person.bild === selectedImage && person.name === selectedName && person.position === selectedPosition
    );

    if (match) {
      moveToCompleted(selectedImage, selectedName, selectedPosition);
    } else {
      clearSelection();
    }
  }
}

function moveToCompleted(image, name, position) {
  const completedContainer = document.getElementById('completedContainer');
  const group = document.createElement('div');
  group.className = 'completed-group';
  
  // Bild mit einheitlicher Größe und Text nebeneinander hinzufügen
  const imageElem = document.createElement('div');
  imageElem.style.backgroundImage = `url(${image})`;
  imageElem.className = 'completed-item';

  const nameElem = document.createElement('div');
  nameElem.textContent = name;
  nameElem.className = 'completed-item';

  const positionElem = document.createElement('div');
  positionElem.textContent = position;
  positionElem.className = 'completed-item';

  group.appendChild(imageElem);
  group.appendChild(nameElem);
  group.appendChild(positionElem);
  completedContainer.appendChild(group);

  removeSelectedItems(image, name, position);
  clearSelection();
}

function removeSelectedItems(image, name, position) {
  const elements = document.querySelectorAll('.option-item');
  
  elements.forEach(elem => {
    if (elem.style.backgroundImage.includes(image) || elem.textContent === name || elem.textContent === position) {
      elem.classList.add('matched');
      elem.remove(); // Entfernt das Element aus der Auswahl
    }
  });
}

function clearSelection() {
  window.selectedImage = null;
  window.selectedName = null;
  window.selectedPosition = null;
  
  document.querySelectorAll('.option-item.selected').forEach(elem => elem.classList.remove('selected'));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

ladeDaten();
