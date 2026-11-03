# useRef

## Состояние и ref решают разные задачи

Хук `useRef(initialValue)` создаёт объект со свойством `current` и сохраняет его между рендерами. Изменение `current` не запускает новый рендер. Поэтому ref подходит для DOM-ссылки или данных, которые не отображаются напрямую, а для текста на экране нужен state.

```jsx
import { useRef } from 'react';

export default function App() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} placeholder="Название задачи" />
      <button onClick={() => inputRef.current?.focus()}>
        Фокус на поле
      </button>
    </>
  );
}
```

React запишет DOM-элемент в `inputRef.current`. `?.` — необязательная цепочка: вызов `focus` произойдёт, только если элемент существует. `focus()` переводит фокус клавиатуры на поле.

## Ограничения

Не изменяйте `ref.current` во время рендера для вычисления JSX. Ref — это escape hatch, а не скрытый способ управлять интерфейсом. Используйте обработчики событий или эффекты для взаимодействия с DOM, а не прямое обращение в теле компонента.

Документация: [useRef](https://react.dev/reference/react/useRef).

## Ref не заменяет состояние

Полный пример для `src/App.jsx`:

```jsx
import { useRef, useState } from 'react';

export default function App() {
  const inputRef = useRef(null);
  const clicksRef = useRef(0);
  const [visibleClicks, setVisibleClicks] = useState(0);

  function handleClick() {
    clicksRef.current += 1;
    setVisibleClicks(clicksRef.current);
    inputRef.current?.focus();
  }

  return (
    <main>
      <input ref={inputRef} placeholder="Название" />
      <button onClick={handleClick}>Запомнить нажатие</button>
      <p>Нажатий: {visibleClicks}</p>
    </main>
  );
}
```

`useRef(0)` возвращает объект `{ current: 0 }`, который React сохраняет между рендерами. Изменение `clicksRef.current` само по себе не обновило бы текст на странице. Мы явно обновляем `visibleClicks` через setter. `inputRef` ссылается на реальный DOM-элемент после его создания; `?.` защищает от попытки вызвать `focus()` у `null`.

**Когда использовать:** хранение идентификаторов таймеров, доступ к DOM для фокусировки или измерений. **Когда не использовать:** основное отображаемое состояние карточек, список задач, текст управляемой формы. Не читайте и не меняйте `ref.current` в процессе рендера, кроме предусмотренных безопасных сценариев инициализации: чистота рендера важна для предсказуемости React.
