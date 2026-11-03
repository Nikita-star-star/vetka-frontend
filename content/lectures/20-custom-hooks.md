# Собственные хуки

## Как переиспользовать логику, а не JSX

Если несколько компонентов должны отслеживать размер окна, можно вынести подписку в функцию-хук. **Пользовательский хук** — функция с именем, начинающимся на `use`, которая может вызывать другие хуки.

`src/useWindowWidth.js`:

```js
import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function update() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}
```

`window.innerWidth` — ширина браузерного окна, `resize` — событие её изменения. В эффекте добавляется обработчик, а cleanup удаляет его, чтобы не накапливать подписки.

`src/App.jsx`:

```jsx
import { useWindowWidth } from './useWindowWidth.js';

export default function App() {
  const width = useWindowWidth();
  return <p>Ширина окна: {width}px</p>;
}
```

Каждый вызов `useWindowWidth()` использует **собственный state**. Хук разделяет реализацию логики, но автоматически не объединяет состояние разных компонентов. Для совместного значения нужен общий родитель или Context.

## Ограничения

Хук вызывается только на верхнем уровне компонента или другого хука; нельзя запускать его по клику, внутри условия или цикла. Не начинайте обычные утилиты с `use`: название сообщает читателю, что к функции применяются правила хуков.

Пример с `window` предполагает браузерный клиентский React через Vite. Для рендеринга на сервере потребовалась бы отдельная проверка доступности `window`.

Документация: [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).

## Повторное использование логики, а не общего state

Пользовательский хук — функция, имя которой начинается с `use`, и которая сама может вызывать другие хуки. Например, несколько компонентов должны показывать ширину окна. Если копировать подписку в каждый компонент, будет много одинакового кода. Выделим `useWindowWidth`.

`src/useWindowWidth.js`:

```js
import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}
```

`src/App.jsx`:

```jsx
import { useWindowWidth } from './useWindowWidth.js';

function ScreenInfo() {
  const width = useWindowWidth();
  return <p>Текущая ширина: {width}px</p>;
}

export default function App() {
  return <ScreenInfo />;
}
```

Хук инкапсулирует подписку, очистку и состояние. При вызове `useWindowWidth` из двух компонентов React создаст **два отдельных состояния и две отдельные подписки**, а не автоматически общее глобальное состояние. Если требуется одно состояние на всех, понадобится поднятие состояния или отдельный источник данных.

**Правила:** вызывайте пользовательские хуки на верхнем уровне компонента или другого хука; не вызывайте их из `if`, цикла или обычного обработчика. Не называйте произвольную вспомогательную функцию `useSomething`, если она не предназначена для правил хуков — имя несёт специальный смысл.
