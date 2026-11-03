# useCallback

## Почему функцию тоже можно кешировать

В JavaScript запись `() => doSomething()` создаёт новую функцию при каждом выполнении выражения. Если такая функция передаётся в `memo`-компонент, её ссылка меняется и может мешать пропуску рендера.

`useCallback(fn, dependencies)` позволяет React обычно сохранять **саму функцию** между рендерами. В отличие от `useMemo`, который сохраняет результат вычисления, `useCallback` сохраняет определение функции.

```jsx
import { memo, useCallback, useState } from 'react';

const SaveButton = memo(function SaveButton({ onSave }) {
  console.log('SaveButton render');
  return <button onClick={onSave}>Сохранить</button>;
});

export default function App() {
  const [title, setTitle] = useState('Задача');
  const [counter, setCounter] = useState(0);

  const save = useCallback(() => {
    console.log('Сохранение:', title);
  }, [title]);

  return (
    <>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={() => setCounter((x) => x + 1)}>{counter}</button>
      <SaveButton onSave={save} />
    </>
  );
}
```

Когда меняется только `counter`, `title` прежний, поэтому `save` обычно остаётся той же функцией. `SaveButton` получает прежние props и может пропустить рендер. При изменении `title` callback обновится, чтобы использовать новое название.

## Ошибки и ограничения

Не оставляйте `[ ]` вместо `[title]`: тогда обработчик может захватить устаревший `title` — это **устаревшее замыкание**. `useCallback` не отменяет необходимости перечислять реактивные зависимости.

Не оборачивайте каждое событие в `useCallback`. Для обычного `<button onClick={...}>` без измеренной проблемы новая ссылка обычно несущественна. React Compiler в настроенном проекте также может выполнять memoization автоматически.

Документация: [useCallback](https://react.dev/reference/react/useCallback).

## Полный пример вместе с memo

```jsx
import { memo, useCallback, useState } from 'react';

const ActionButton = memo(function ActionButton({ onAction }) {
  console.log('Render ActionButton');
  return <button onClick={onAction}>Увеличить</button>;
});

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const increase = useCallback(() => {
    setCount((previous) => previous + 1);
  }, []);

  return (
    <main>
      <p>Счётчик: {count}</p>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <ActionButton onAction={increase} />
    </main>
  );
}
```

На каждом рендере `App` выражение `() => ...` без `useCallback` создало бы новую функцию. У функций, как и у объектов, сравнение по ссылке: две одинаковые записи не обязательно обозначают одну функцию. Поскольку `ActionButton` обёрнут в `memo`, стабильный `increase` позволяет ему пропускать часть ненужных повторных рендеров, пока остальные props не меняются.

**Почему здесь зависимость пустая:** обработчик не читает `count` напрямую, а пользуется функциональной формой setter. Если бы функция читала изменяемые props или state из рендера, их пришлось бы включить в зависимости.

**Когда пользы нет:** если `ActionButton` не обёрнут в `memo` и функция не используется как зависимость другого хука, стабильная ссылка сама по себе не даёт ощутимого результата. Добавление `useCallback` повсюду только усложняет код.
