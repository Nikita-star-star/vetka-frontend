# useContext

## Когда props приходится передавать через много уровней

Представим приложение, где тема оформления нужна заголовку, странице и кнопкам. Если значение проходит через несколько промежуточных компонентов, которые сами его не используют, это называется **prop drilling** — последовательная передача props через множество уровней.

**Context** — механизм React, позволяющий передавать общее значение компонентам внутри дерева без ручного пробрасывания его через каждый промежуточный компонент.

## Создание контекста

`src/ThemeContext.js`:

```js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
```

`createContext('light')` создаёт контекст со значением по умолчанию `'light'`.

`src/ThemeLabel.jsx`:

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

export default function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>Тема: {theme}</p>;
}
```

`useContext` — хук, который читает ближайшее значение заданного Context.

`src/App.jsx`:

```jsx
import { ThemeContext } from './ThemeContext.js';
import ThemeLabel from './ThemeLabel.jsx';

export default function App() {
  return (
    <ThemeContext value="dark">
      <h1>Настройки</h1>
      <ThemeLabel />
    </ThemeContext>
  );
}
```

В React 19 допустимо использовать сам объект контекста как provider (`<ThemeContext value="dark">`). В более старом коде можно встретить `<ThemeContext.Provider value="dark">`. На экране появится «Тема: dark».

## Когда Context не нужен

Если значение используется всего двумя соседними компонентами, обычные props проще. Context не является обязательным «глобальным хранилищем» и не заменяет привычное управление состоянием. Его задача — удобная доставка общего значения.

Подробнее: [React — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context).


## Как Context вызывает обновления

Когда значение provider меняется, использующие этот контекст компоненты получают новое значение и могут перерендериться. Context не означает, что все значения приложения нужно хранить в одном объекте и передавать повсюду.

Если передать новый объект `value={{ theme }}` при каждом рендере, его ссылка будет другой даже при одинаковом `theme`. Обычно это не проблема для небольшого приложения; в большом дереве сначала измерьте возможную стоимость. Дробите контексты по смыслу, если разные потребители используют разные часто меняющиеся значения.

## Кто обновится при смене контекста

`createContext` создаёт объект контекста. **Provider** — компонент-источник значения для вложенного дерева. `useContext` находит ближайший подходящий Provider и возвращает его текущее значение. Если передать новое значение, потребители данного контекста могут быть повторно отрендерены.

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function Status() {
  const theme = useContext(ThemeContext);
  return <p>Выбрана тема: {theme}</p>;
}

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <button onClick={() => setTheme((old) => old === 'light' ? 'dark' : 'light')}>
        Сменить тему
      </button>
      <Status />
    </ThemeContext>
  );
}
```

При нажатии меняется `theme`, `App` рендерится повторно, Provider получает новое значение, а `Status` читает его через хук. В React 19 корректно писать `<ThemeContext value={...}>`; исторический синтаксис `<ThemeContext.Provider>` тоже встречается в старых примерах.

**Ограничение:** если значение контекста — новый объект, создаваемый на каждом рендере, потребители могут получать изменения даже при прежних данных. Не превращайте один глобальный Context в хранилище абсолютно всего: для локального взаимодействия обычные props проще и нагляднее.
