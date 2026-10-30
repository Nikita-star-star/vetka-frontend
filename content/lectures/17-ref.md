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
