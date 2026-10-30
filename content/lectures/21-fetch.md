# Запросы к API

## Откуда приходят данные

До сих пор задачи существовали только в памяти страницы и исчезали после обновления браузера. Реальные приложения часто запрашивают данные у **сервера** — программы, которая принимает запросы и возвращает ответы.

**API** (Application Programming Interface) — согласованный способ взаимодействия программ. **HTTP** — протокол, то есть набор правил передачи запросов и ответов между браузером и сервером.

Частые HTTP-методы: `GET` получает данные, `POST` создаёт ресурс, `PATCH` частично изменяет ресурс, `DELETE` удаляет ресурс.

**JSON** — текстовый формат передачи данных, похожий на JavaScript-объекты. Например:

```json
[
  { "id": 1, "title": "Изучить React", "done": false }
]
```

JSON использует двойные кавычки для имён свойств и строк. Он не содержит JavaScript-функций.

## Получение данных через fetch

**Fetch API** — встроенная возможность браузера отправлять HTTP-запросы. Используем общедоступный учебный сервис JSONPlaceholder.

```js
async function loadTodo() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }

  const todo = await response.json();
  console.log(todo.title);
}

loadTodo().catch(console.error);
```

Разбор: `fetch` возвращает Promise. `await` ждёт ответ. `response.ok` показывает, что статус HTTP успешный. Важно: статус 404 сам по себе обычно не отклоняет Promise `fetch`; поэтому проверка необходима. `response.json()` читает и преобразует JSON-ответ в JavaScript-значение.

## Запрос из компонента React

`src/App.jsx`:

```jsx
import { useEffect, useState } from 'react';

export default function App() {
  const [todo, setTodo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/1',
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Не удалось загрузить');
        const data = await response.json();
        setTodo(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p role="alert">Ошибка: {error}</p>;
  if (!todo) return <p>Данных нет</p>;

  return <h1>{todo.title}</h1>;
}
```

Здесь `null` обозначает отсутствие объекта. `AbortController` — встроенный механизм отмены запроса. Поле `signal` передаётся в `fetch`, а `abort()` вызывается при очистке эффекта. Если компонент исчезнет до завершения запроса, результат больше не понадобится.

Мы отдельно различаем **загрузку**, **ошибку**, **отсутствие данных** и **успешный результат**. Это обязательные состояния сетевого интерфейса.

JSONPlaceholder предоставляет учебные данные, но не сохраняет изменения как полноценная база данных. Для создания/редактирования своих данных понадобится настоящий или локальный API.

Источники: [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [JSONPlaceholder](https://jsonplaceholder.typicode.com/).


## Повторный запрос после ошибки

Чтобы реализовать кнопку «Повторить», можно хранить `retryKey` в state и добавить его к списку зависимостей эффекта. Изменение ключа заставит компонент заново синхронизироваться с сервером. Такой подход оправдан именно для GET при показе страницы. Для POST, инициированного пользователем, используйте submit-handler.

Отличайте **клиентское состояние** (например, открыта ли подсказка) от **серверных данных** (например, список задач из API). Серверные данные могут устареть в любой момент; если приложение разрастается, для кеширования и повторных запросов могут понадобиться специализированные инструменты, но в этом курсе мы изучаем базовые механизмы Fetch и React.
