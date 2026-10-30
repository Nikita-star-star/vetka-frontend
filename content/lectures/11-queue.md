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
