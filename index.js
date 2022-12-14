const name = document.querySelector('#name');
const secondName = document.querySelector('#secondName');
const email = document.querySelector('#email');
const btn = document.querySelector('.btn');
const users = document.querySelector('.users');
const clear = document.querySelector('.clear');

// Объект для localStorage, забирает информацию по ключу 'users'
const storage = JSON.parse(localStorage.getItem('users')) || {};

// Функция установки слушателей на HTML узлы
function setListeners() {
  const del = document.querySelectorAll('.delete');
  const change = document.querySelectorAll('.change');
  let clicked;

  del.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('УДАЛИТЬ кнопка');
      console.log('=== NODE:', n);
      clicked = n.getAttribute('data-delete');

      const outer = document.querySelector(`[data-out="${clicked}"]`);
      console.log('=== outer', outer);
    });
  });

  change.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('=== ПРИМЕНИТЬ кнопка');
    });
  });
}

// Функция очистки хранилища localStorage по ключу `users`
function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem('users');
}

// Функция создания карточки
function createCard({ name, secondName, email }) {
  return `
    <div data-out=${email} class="user-outer">
        <div class="user-info">
            <p>${name}</p>
            <p>${secondName}</p>
            <p>${email}</p>
        </div>
        <div class="menu">
            <button data-delete=${email} class="delete">Удалить</button>
            <button data-change=${email} class="change">Применить</button>
        </div>
    </div>
  `;
}

function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
  */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
  */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    console.log('USER  === ', user);
    console.log('EMAIL === ', email);
    console.log('DATA  === ', userData);

    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

// Функция получения данных из хранилища localStorage по ключу `users`
function getData(e) {
  e.preventDefault();
  const data = {};

  data.name = name.value || '';
  data.secondName = secondName.value || '';
  data.email = email.value || '';

  const key = data.email;
  storage[key] = data;

  localStorage.setItem('users', JSON.stringify(storage));

  rerenderCard(JSON.parse(localStorage.getItem('users')));

  return data;
}

// Экземпляр объекта, наблюдающий за DOM-элементом и запускающий колбэк в случае изменений
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      console.log('Карта USERS обновилась');
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener('click', getData);
clear.addEventListener('click', clearLocalStorage);

// Функция для отображения указанного HTML узла
function show(el) {
  el.style.display = 'block';
}

// Функция для скрытия указанного HTML узла
function hide(el) {
  el.style.display = 'none';
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
