// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// Объект MAP для сопоставления цвета фрукта с классом CSS для задания цвета карточки...
// Пока ничего другого не придумалось... Не оставлять же не использоваными пять классов CSS
// Если бы цвета фруктов были бы на английском и совпадали с названием цветов CSS
// Можно было бы динамически создавать имя класса `fruit_${color}`, но заранее заготовленных классов не напасешься...
// Или задавать цвет фона карточки через element.style.background = color, что тоже так себе идея...
// Вариант использовать выбор цвета через <input type="color"> и задание через style, но где брать название цвета прописью?
// Можно ограничить выбор цвета в поле colorInput?

const mapColor = new Map([
  ['фиолетовый', 'fruit_violet'],
  ['зеленый', 'fruit_green'],
  ['розово-красный', 'fruit_carmazin'],
  ['желтый', 'fruit_yellow'],
  ['светло-коричневый', 'fruit_lightbrown'],
  ['черный', 'fruit_default']
]);

// отрисовка карточек
const display = () => {

  // Очищаем список UL с карточками фруктов
  fruitsList.innerHTML = '';

  // В цикле созаем элементы Li с данными для карточек и добавляем в конец списка UL
  for (let i = 0; i < fruits.length; i++) {

    // document.appendChild - в учебнике написано, что метод устарел...

    // Элементы Div с данными для карточками
    let elementDivIndex = document.createElement('div');
    elementDivIndex.innerHTML = `index: ${i}`;
    let elementDivKind = document.createElement('div');
    elementDivKind.innerHTML = `kind: ${fruits[i]['kind']}`;
    let elementDivColor = document.createElement('div');
    elementDivColor.innerHTML = `color: ${fruits[i]['color']}`;
    let elementDivWeight = document.createElement('div');
    elementDivWeight.innerHTML = `weight (кг): ${fruits[i]['weight']}`;

    // Какая то обёртка с классом  fruit__info
    let elementDiv = document.createElement('div');
    elementDiv.classList.add("fruit__info");

    // Элемет Li + класс CSS fruit__item и класс задающий цвет фона
    let elementLi = document.createElement("li");
    elementLi.classList.add("fruit__item");
    if (mapColor.has(fruits[i]['color'])) {
      elementLi.classList.add(mapColor.get(fruits[i]['color']));
    } else {
      elementLi.classList.add("fruit_default");
    }

    // Собираем нашу "Матрёшку"
    // Элеменнты с данными помещаем в элемент обёртку
    elementDiv.append(elementDivIndex);
    elementDiv.append(elementDivKind);
    elementDiv.append(elementDivColor);
    elementDiv.append(elementDivWeight);

    // Далее все выше собранное помещаем в элемент списка Li
    elementLi.append(elementDiv);

    // Далее помещаем готовый элемент Li в конец списка Ul
    fruitsList.append(elementLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  // Копия массива fruits, из него будем перекладывать в result
  let tempArray = fruits.slice();

  // Массив в который будем перекладывать элементы из tempArray
  let result = [];

  // ruits.splice(index, 1) возвращает массив из одного элемента, чтобы записать в result значение дописываем [0]
  while (tempArray.length) {
    let index = getRandomInt(0, tempArray.length - 1);
    result.push(tempArray.splice(index, 1)[0]);
  }

  // Массив не большой, так что сравним исходный массив fruits с "перемешанным" result самым простым способом
  // Странно что нет встроенной функции сравнения массивов...
  if (JSON.stringify(fruits) == JSON.stringify(result)) {
    // Ничто так не раздражает как Alert!!!
    alert('Что то пошло не так... Карточки остались в том же порядке... Перемешайте еще раз');
  }

  // Теперь у нас два массива =(
  fruits = result;

  // Не понятно почему в JS нельзя удалить объявленную переменную.... delete или unset...
  // delete result;
  // delete tempArray;
  result = [];
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {

  // Выбераем поля мин и макс весом фруктов
  let minWeightElement = document.querySelector(".minweight__input");
  let maxWeightElement = document.querySelector(".maxweight__input");

  // Проводим минимальную проверку и приведение значений к типу Number
  if (minWeightElement.value && maxWeightElement.value) {
    let minweight = (Number.parseInt(minWeightElement.value));
    minweight = (isNaN(minweight) || (minweight < 1) || (minweight > 100)) ? 1 : minweight;
    let maxweight = (Number.parseInt(maxWeightElement.value));
    maxweight = (isNaN(maxweight) || (maxweight < 1) || (maxweight > 100)) ? 100 : maxweight;
    if (maxweight < minweight) {
      [minweight, maxweight] = [maxweight, minweight]
    }

    // Отображаем нормализованные значения в полях ()
    minWeightElement.value = minweight;
    maxWeightElement.value = maxweight;

    // Так как fruits.filter исключает часть елементов массива не удовлетворяющих условиям
    // Для отображения всех карточек и повторной сортировки приходится создавать массив заново из списка фруктов в JSON формате
    // Если после сортировки массива из него ничего не удалено оставим массив как он есть
    let tempArray = JSON.parse(fruitsJSON);
    fruits = (tempArray.length > fruits.length) ? tempArray : fruits;

    // Фильтруем массив fruits по свойству "Вес"
    fruits = fruits.filter((item) => {
      let weight = item.weight;
      return (weight >= minweight) && (weight <= maxweight);
    });
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ['фиолетовый', 'зеленый', 'розово-красный', 'желтый', 'светло-коричневый'];
  a = priority.indexOf(a.color);
  b = priority.indexOf(b.color);
  return a > b;
};

const swap = (array, firstIndex, secondIndex) => {
  [array[firstIndex], array[secondIndex]] = [array[secondIndex], array[firstIndex]];
  return true;
}

const sortAPI = {
  // Пузырьковая сортировка
  bubbleSort(arr, comparation) {
    // Индекс последнего элемента массива
    let maxElementIndex = arr.length - 1;
    // Проходим в цикле все элементы массива, во вложенном цикле сравниваем текущий и соседний элемент справа
    // Если текущий элемент больше элемента находящегося справа, меняем их местами
    // Указатель на текущий элемент каждую итерацию сдвигается на один элемент в право
    // Каждую итерацию один элемент с максимальным значением перемещается в правую часть массива
    // (до момента пока справа от него не окажется элемент с большим значением)
    for (let i = 0; i < maxElementIndex; i++) {
      // Флаг была ли перестановка элементов, если после очередной итерации вложенного цикла перестановки небыло
      // Считаем что массив отсортированб всвязи с чем обрываем цикл
      let wasSwap = false;
      // Така как каждый проход в правой части массива оказывается элемент с максимальным значением
      // Уменьшаем количество итераций вложенного цикла maxElementIndex - i (на количество уже отсортированнх элементов т.е. i)
      for (let j = 0; j < maxElementIndex - i; j++) {
        // Сравнение текущего и соседнего элементов
        if (comparation(arr[j], arr[j + 1])) {
          // Производим перестановку и выставление флага о перестановке
          wasSwap = swap(arr, j, j + 1)
        }
      };
      if (!wasSwap) { break };
    };
  },
  // НЕ РАБОТАЕТ
  quickSort(arr, comparation) {

    function partition(array, left, right) {
      let pivot = array[Math.floor((right + left) / 2)];
      let i = left;
      let j = right;
      while (i <= j) {
        // while (comparation(pivot,array[i]) {
        while (array[i] < pivot) {
          i++;
        }
        // while (comparation(array[j],pivot)) {
        while (array[j] > pivot) {
          j--;
        }
        if (i <= j) {
          let wasSwap = swap(array, i, j);
          i++;
          j--;
        }
      }
      return i;
    }

    function quickSort(array, left, right) {
      let index;
      if (array.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? array.length - 1 : right;
        index = partition(array, left, right);
        if (left < index - 1) {
          quickSort(array, left, index - 1);
        }
        if (index < right) {
          quickSort(array, index, right);
        }
      }
      return array;
    }
    quickSort(arr);
  },

  // выполняет сортировку и производит замер времени
  // при текущем количестве элементов массива (5) сортировка иногда производится менее чем за 1 мс
  // поэтому периодически время сортировки будет отображаться как "0"
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${(end - start).toFixed()} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = (sortKind === "bubbleSort") ? "quickSort" : "bubbleSort";
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // При текущей длинне массива эту надпись мы не увидим
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  // Проверки ни какие не делаю, времени не осталось =(
  // 
  if (kindInput.value && colorInput.value && weightInput.value) {
    let obj = {};
    obj.kind = kindInput.value;
    obj.color = colorInput.value;
    obj.weight = weightInput.value;
    fruits.push(obj);
  } else {
    alert('Необходимо заполнить все поля!');
  }
  display();
});
