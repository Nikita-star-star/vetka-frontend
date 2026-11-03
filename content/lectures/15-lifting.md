# Поднятие состояния

## Почему данные не должны дублироваться

Представим компонент формы и компонент списка. Форма создаёт задачи, а список их показывает. Если каждый хранит свой независимый массив, они не будут автоматически согласованы.

**Поднятие состояния** — перенос общего state в ближайший общий родительский компонент. Родитель передаёт данные вниз через props, а дочерний компонент сообщает о действиях через функции, также полученные в props.

## Разделяем форму и список

`src/NewTaskForm.jsx`:

```jsx
import { useState } from 'react';

export default function NewTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    onAdd(value);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-title">Задача</label>
      <input id="new-title" value={title}
        onChange={(event) => setTitle(event.target.value)} />
      <button type="submit">Добавить</button>
    </form>
  );
}
```

`onAdd` — prop-функция. Компонент формы знает, *какой текст ввёл пользователь*, но не обязан знать, *где хранятся все задачи*.

`src/TaskList.jsx`:

```jsx
export default function TaskList({ tasks }) {
  if (tasks.length === 0) return <p>Задач нет</p>;

  return (
    <ul>
      {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
    </ul>
  );
}
```

`src/App.jsx`:

```jsx
import { useState } from 'react';
import NewTaskForm from './NewTaskForm.jsx';
import TaskList from './TaskList.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);

  function addTask(title) {
    setTasks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), title }
    ]);
  }

  return (
    <main>
      <h1>Мои задачи</h1>
      <NewTaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}
```

Теперь один `tasks` — **источник истины**. Форма отправляет новое название родителю; родитель обновляет массив; список получает обновлённый prop и отображает новую задачу.

## Когда не нужно поднимать state

Текст в поле формы до отправки нужен только форме — поэтому `title` остаётся внутри `NewTaskForm`. Не стоит переносить весь локальный state в `App`: состояние должно находиться как можно ближе к тем компонентам, которым оно действительно требуется.


## Производные данные и единый источник истины

Не создавайте второй массив `visibleTasks` в state, если он всегда вычисляется как `tasks.filter(...)`. Иначе придётся синхронизировать две копии данных при каждом действии. Отфильтрованный список — **производное значение**.

```js
const visibleTasks = tasks.filter((task) => task.done === showCompleted);
```

Такой код выполняется при рендере и использует актуальные значения. Его не нужно переносить в `useEffect`: это вычисление, а не работа с внешней системой.

[Лабораторная работа №2: состояние и интерактивность](../labs/02.md)

## Как найти правильное место для состояния

Рассмотрите дерево `App → SearchField` и `App → TaskList`. Текст поискового запроса нужен обоим: поле его меняет, список фильтрует данные по нему. Если хранить `query` только в `SearchField`, список не сможет получить новое значение, не прибегая к обходным каналам. Поместите `query` в `App` и передайте его в оба компонента через props.

Задачи остаются в одном `tasks` у родителя. `TaskList` получает отображаемую коллекцию, а не копирует её в собственный state. Результат фильтрации можно вычислить:

```jsx
const visibleTasks = tasks.filter((task) =>
  task.title.toLowerCase().includes(query.toLowerCase())
);
```

Это **производное значение** — его всегда можно заново получить из `tasks` и `query`. Отдельный `setVisibleTasks` не нужен: иначе придётся постоянно синхронизировать два массива.

## Когда подъём состояния вреден

Состояние «открыта ли подсказка у одного поля» нужно только этому полю — оставьте его там. Поднимайте лишь данные, которые действительно участвуют в совместной работе компонентов. Один громадный родительский компонент со всем состоянием приложения затрудняет сопровождение и провоцирует лишние связи.
