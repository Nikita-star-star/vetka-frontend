# Формы

## Как получить текст из input

В обычном HTML пользователь вводит данные в `<input>`. В React важно, чтобы отображаемый текст и данные программы не расходились.

**Управляемое поле** — элемент формы, значение которого задаётся состоянием React. Изменения пользователя передаются обратно в это состояние.

`src/App.jsx`:

```jsx
import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState('');

  return (
    <label>
      Название задачи
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <p>Введено: {title}</p>
    </label>
  );
}
```

`value` указывает текущее значение поля. `onChange` вызывается при изменении текста. `event.target` обозначает элемент, в котором произошло событие; его `value` содержит введённую строку. `setTitle` сохраняет строку в состоянии, после чего React обновляет и input, и абзац.

## Обработка отправки

Используйте семантическую форму `<form>`, а не только обработчик клика по кнопке. Тогда отправка работает и по Enter.

```jsx
import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    if (value === '') return;

    setTasks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), title: value }
    ]);
    setTitle('');
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task-title">Название задачи</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
      <ul>
        {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
      </ul>
    </main>
  );
}
```

`preventDefault()` отменяет стандартную отправку HTML-формы с перезагрузкой страницы. `trim()` убирает пробелы по краям строки. Если текста нет, `return` прекращает обработку. После добавления поле очищается.

## Валидация

**Валидация** — проверка данных перед использованием. Например, можно потребовать минимум три символа:

```js
if (value.length < 3) {
  alert('Название должно содержать минимум 3 символа');
  return;
}
```

Для настоящего интерфейса лучше показывать сообщение об ошибке рядом с полем, а не через `alert`. При сетевой отправке данные обязательно проверяет также сервер: клиентская валидация не гарантирует безопасность.

## Checkbox и select

У checkbox читают `event.target.checked` (логическое значение), а у `<select>` — `event.target.value`. Это те же управляемые элементы с разными видами данных.

Подписывайте поля через `<label>`, чтобы они были понятны пользователю и средствам доступности. **Доступность** означает возможность работать с интерфейсом, в том числе с клавиатуры и программами чтения экрана.


## Управляемая и неуправляемая формы

В **управляемом** input значение задаёт React через `value`; каждое изменение обновляет state. В **неуправляемом** поле текущее значение хранит сам DOM. Например, поле можно прочитать при отправке формы через `FormData`:

```jsx
export default function SimpleForm() {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('title'));
  }
  return (
    <form onSubmit={submit}>
      <label>Задача <input name="title" /></label>
      <button type="submit">Сохранить</button>
    </form>
  );
}
```

`FormData` — встроенный браузерный объект для сбора полей формы по атрибуту `name`. Такой способ подходит, когда не нужно реагировать на каждое изменение символа. Controlled input полезен, когда нужно сразу показывать результат, валидировать и синхронизировать значения.

При создании нескольких управляемых полей можно использовать отдельные состояния или объект значений. Выбирайте структуру, которую легче читать, не дублируйте поля одновременно в нескольких состояниях.

## Управляемый и неуправляемый ввод

**Управляемое поле** получает значение из React-state через `value`, а изменение передаёт через `onChange`. Это подходит, когда нужно сразу показывать ошибку, блокировать отправку или синхронизировать другое содержимое страницы. **Неуправляемое поле** хранит актуальное значение в самом DOM. Его можно прочитать при отправке через `FormData`, не создавая state на каждый символ.

```jsx
export default function App() {
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    alert(data.get('title'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Задача</label>
      <input id="title" name="title" defaultValue="Повторить React" />
      <button type="submit">Сохранить</button>
    </form>
  );
}
```

`defaultValue` задаёт начальное значение, но не заставляет React управлять каждым последующим изменением. `name` нужен для получения поля из `FormData`. Этот способ удобен, если не требуется реакция на каждый введённый символ.

## Валидация без путаницы

Проверяйте нормализованное значение (`trim()`), а не только исходную строку. Для обычных форм начните с встроенных HTML-атрибутов `required`, `minLength` и `type`, а при необходимости добавляйте бизнес-правила в обработчике. Не путайте проверку формы в браузере с проверкой на сервере: доверять исключительно клиентской валидации нельзя.
