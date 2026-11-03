# useReducer

## Когда нескольких setState становится трудно читать

Если у задачи можно менять статус, название и приоритет, а также добавлять и удалять задачи, логика обновлений начинает повторяться. **Reducer** — чистая функция `(state, action) => nextState`, которая вычисляет новое состояние по описанию события.

**Action** — объект, называющий произошедшее действие и содержащий необходимые данные. **Dispatch** — функция для отправки action в reducer.

`src/tasksReducer.js`:

```js
export function tasksReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [...state, action.task];
    case 'removed':
      return state.filter((task) => task.id !== action.id);
    case 'toggled':
      return state.map((task) =>
        task.id === action.id ? { ...task, done: !task.done } : task
      );
    default:
      return state;
  }
}
```

`switch` выбирает действие по полю `action.type`. Reducer не изменяет старый массив и не обращается к серверу — он только вычисляет следующее состояние.

`src/App.jsx`:

```jsx
import { useReducer } from 'react';
import { tasksReducer } from './tasksReducer.js';

const initialTasks = [{ id: 1, title: 'React', done: false }];

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return (
    <>
      {tasks.map((task) => (
        <button key={task.id} onClick={() => dispatch({ type: 'toggled', id: task.id })}>
          {task.title}: {task.done ? 'готово' : 'в работе'}
        </button>
      ))}
    </>
  );
}
```

`useReducer` получает reducer и начальное состояние, а возвращает текущее значение и `dispatch`. В отличие от `useState`, компонент описывает *что случилось*, а reducer централизованно определяет *как меняется state*.

## Когда оставить useState

Для одного флага `isOpen` или простого поля `title` reducer избыточен. Он оправдан, когда несколько связанных переходов трудно понять в нескольких отдельных обработчиках. Обновления reducer также участвуют в рендерах React; это не отдельное глобальное хранилище.

Документация: [useReducer](https://react.dev/reference/react/useReducer).

## От нескольких setter к reducer

Если задача может быть добавлена, удалена и отмечена выполненной, обработчики часто повторяют операции над одним массивом. **Reducer** — чистая функция, которая принимает текущее состояние и описание действия, а возвращает новое состояние. **Action** — объект, указывающий, что произошло; **dispatch** — функция отправки действия React.

```jsx
import { useReducer } from 'react';

function reducer(tasks, action) {
  switch (action.type) {
    case 'add':
      return [...tasks, { id: crypto.randomUUID(), title: action.title }];
    case 'remove':
      return tasks.filter((task) => task.id !== action.id);
    default:
      return tasks;
  }
}

export default function App() {
  const [tasks, dispatch] = useReducer(reducer, []);
  return (
    <main>
      <button onClick={() => dispatch({ type: 'add', title: 'Новая задача' })}>
        Добавить
      </button>
      <p>Всего: {tasks.length}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => dispatch({ type: 'remove', id: task.id })}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

Поток выполнения: обработчик вызывает `dispatch` → React ставит действие в очередь → вызывает reducer с текущим состоянием и action → получает новый массив → рендерит компонент с новым состоянием. Reducer нельзя использовать для HTTP-запросов, случайных побочных эффектов или изменения внешних переменных. Создание `id` выполняется до передачи действия: reducer остаётся чистым.

Если state состоит из пары независимых полей, `useState` обычно понятнее. Reducer полезен, когда правила изменения сложны и хочется сосредоточить их в одном месте.
