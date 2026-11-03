# Очередь обновлений

## Почему три вызова setter не всегда прибавляют три

React группирует несколько обновлений состояния, чтобы не выполнять лишние промежуточные перерисовки. Это называется **batching** — пакетная обработка.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  function addThreeWrong() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={addThreeWrong}>{count}</button>;
}
```

Если `count` был равен нулю, все три строки запрашивают значение `1` из одного снимка. В результате число станет `1`, а не `3`.

## Функциональный updater

```jsx
function addThreeCorrectly() {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
  setCount((current) => current + 1);
}
```

Теперь React ставит три функции в очередь. При обработке каждая получает результат предыдущей: `0 → 1 → 2 → 3`. Это объясняет, почему форма setter с функцией надёжнее, когда следующее значение зависит от предыдущего.

Updater должен быть **чистой функцией**: только вычислять и возвращать новое состояние, без запроса к серверу или изменения DOM. В режиме Strict Mode React может вызывать updater дополнительно для проверки чистоты.

## Чего batching не означает

Это не универсальное правило «React вызывает компонент ровно один раз». Рендеры могут происходить по разным причинам и в разном порядке. React группирует обновления, когда это безопасно, но корректный код не должен зависеть от точного количества вызовов компонента.

Документация: [Queueing State Updates](https://react.dev/learn/queueing-a-series-of-state-updates).

## Почему три вызова setter не всегда означают +3

```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function wrongIncrease() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function rightIncrease() {
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
  }

  return (
    <>
      <p>Значение: {count}</p>
      <button onClick={wrongIncrease}>Обычные +1 трижды</button>
      <button onClick={rightIncrease}>Функциональные +1 трижды</button>
    </>
  );
}
```

После первого нажатия обычной кнопки значение увеличится только на 1: каждая команда использует одинаковый `count` текущего снимка. После второго типа нажатия значение увеличится на 3: каждая функция получит результат предыдущего обновления из очереди.

**Batching** (пакетная обработка) означает, что React группирует несколько обновлений для более эффективной работы. Однако делать вывод «один обработчик = всегда один конкретный вызов компонента» нельзя: режим разработки, границы обновлений и внутреннее планирование влияют на наблюдаемое количество вызовов. Опирайтесь на конечный результат состояния, а не на число `console.log`.
