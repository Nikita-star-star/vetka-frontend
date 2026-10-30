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
