# Маршрутизация

## Как одна страница показывает несколько экранов

**Маршрутизация** — выбор отображаемого содержимого на основании адреса (URL) в браузере. Например, `/` — главная страница, `/about` — информация о приложении.

**SPA** (Single Page Application) — приложение, которое может менять экран без полной загрузки нового HTML-документа. Для клиентской маршрутизации используем библиотеку React Router.

Установите пакет из папки React-проекта:

```bash
npm install react-router
```

## Настройка Router

Замените `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

`BrowserRouter` следит за адресом браузера. `StrictMode` — режим проверки приложения во время разработки; он помогает обнаружить неправильные побочные эффекты.

`src/App.jsx`:

```jsx
import { Routes, Route, Link } from 'react-router';

function Home() {
  return <h1>Мои задачи</h1>;
}

function About() {
  return <h1>О приложении</h1>;
}

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Задачи</Link>{' '}
        <Link to="/about">О проекте</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>Страница не найдена</h1>} />
      </Routes>
    </>
  );
}
```

`Routes` выбирает подходящий `Route`. `path` указывает путь, `element` — отображаемый JSX. `*` соответствует неизвестным адресам (страница 404). `Link` создаёт внутренний переход без полной перезагрузки приложения.

## Параметры адреса

Иногда часть адреса обозначает идентификатор, например `/tasks/42`. Это **параметр маршрута**.

```jsx
import { useParams } from 'react-router';

function TaskPage() {
  const { taskId } = useParams();
  return <h1>Задача №{taskId}</h1>;
}
```

Чтобы показать этот компонент, добавьте внутри `Routes`:

```jsx
<Route path="/tasks/:taskId" element={<TaskPage />} />
```

Двоеточие отмечает переменную часть адреса. Значение параметра всегда следует считать строкой, даже если URL содержит цифры.

## Размещение на хостинге

При прямом открытии `/tasks/42` обычный статический сервер может ответить 404, потому что такого HTML-файла нет. Для SPA с `BrowserRouter` сервер обычно настраивают так, чтобы он возвращал `index.html` для клиентских маршрутов. Это называется **SPA fallback**.

Источник: [React Router — Declarative Mode](https://reactrouter.com/start/declarative/installation).
