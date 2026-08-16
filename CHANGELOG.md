# Changelog

Формат по мотивам [Keep a Changelog](https://keepachangelog.com/). С 2026-08-16 каждое изменение проекта фиксируется здесь.

## [Unreleased]

### Added (2026-08-16, session 4 — repo conventions)

- Приведён к виду остальных репозиториев автора (агентство Agama Labs, PDX-локальный бизнес-сайты: pnwstumppros.com, stoneworkspdx.com, eventgearpdx.com и т.д.):
  - `.env` (публичный, коммитится) — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_PROJECT_NAME`; `.gitignore` меняет схему игнора env-файлов на `.env.*` + `!.env.example` (секреты остаются только в `.env.local`, не в git).
  - `.prettierrc` + `.prettierignore` (исключены `.claude/`, `archive/`, `drizzle/meta/`), `prettier` в devDependencies, скрипты `format`/`format:check`; весь код прогнан через `prettier --write`.
  - `src/app/robots.ts`, `src/app/sitemap.ts` (все 4 страницы) на `NEXT_PUBLIC_SITE_URL`.
  - `layout.tsx`: `metadataBase`, openGraph/twitter метаданные, `GoogleAnalytics` из `@next/third-parties/google` (условно, по `NEXT_PUBLIC_GA_ID`), `public/favicon.svg` (SC-монограмма).
  - `src/components/developer/Developer.tsx` + `.module.css` — фирменная плашка "Agama Labs" в футере (используется во всех проектах автора), подключена в `Footer.tsx`.
  - `README.md` переписан под их шаблон (краткий, на английском, с секциями Installation/Dev-mode/Tech Stack); `package.json#name` → `sportscavebarbershop.com`.
  - `.gitignore`: пользователь добавил `.claude` в игнор (аналогично `archive`) — оба каталога сознательно не попадают в репозиторий.
- Настройки самого GitHub-репозитория (description, homepage, topics, social preview) требуют доступа, которого у меня нет — инструкции переданы пользователю в чате.

### Changed (2026-08-16, session 3)

- Редизайн `Header`: убран шаблонный полупрозрачный blur-фон (`bg-background/95 backdrop-blur`) в пользу сплошного `bg-background`; на десктопе добавлено выделение активной страницы (`usePathname`, нижняя граница цвета `primary`).
- Мобильное меню переделано с нуля: вместо гамбургер-иконки + выпадающей панели — полноэкранный оверлей "The Roster" с рядами-нашивками (nameplate, по мотивам `archive/stitch-mockups/gridiron_groom/DESIGN.md` — "styled like vintage athletic locker nameplates"), где каждый пункт меню подписан тем же тегом, что уже используется на самой странице (Home → "Game-Day Ready", Services → "The Playbook", Team → "The Roster", Book Now → "Draft Your Lineup"). Тоггл — текстовая метка `MENU`/`CLOSE` в JetBrains Mono вместо иконки.
- Добавлены a11y-детали полноэкранного меню: `Escape` закрывает, фокус уходит на кнопку `Close` при открытии, `inert` на панели пока она закрыта, блокировка скролла `<html>` пока меню открыто.

### Added (2026-08-16, session 2)

- Реальные (стоковые, Unsplash) фото вместо `PortraitPlaceholder`-заглушек: hero-фон на Home, "visual break" на Services, портреты всех 3 мастеров на Team. Источники и лицензия — [docs/image-credits.md](docs/image-credits.md).
- Компонент даты в бронировании — `react-day-picker` (v10) вместо `<input type="date">`: кастомная тема через CSS-переменные `--rdp-*` в `globals.css` (квадратные ячейки вместо круглых — по правилам формы бренда), даты в прошлом и закрытые дни (вс/пн) задизейблены на уровне календаря, а не только текстом.
- `nextOpenDay()` в `BookingWizard` — дата по умолчанию при входе в шаг "Time" теперь всегда ближайший открытый день, а не сегодня (если сегодня салон закрыт).

### Fixed (2026-08-16, session 2)

- Дата "сегодня" в визарде бронирования считалась через `toISOString()` (UTC) — в часовом поясе Орегона это переключало календарь на "завтра" уже с середины дня. Заменено на `date-fns format()` (локальные компоненты даты).

### Added

- Инфраструктура Claude Code: `CLAUDE.md`, 21 skill в `.claude/skills/` (Anthropic `frontend-design`; Vercel: `deploy-to-vercel`, `vercel-cli-with-tokens`, `vercel-optimize`, `web-design-guidelines`, `react-best-practices`, `react-view-transitions`, `composition-patterns`, `writing-guidelines`; Emil Kowalski: `emil-design-eng`, `animate`, `find-animation-opportunities`, `improve-animations`, `review-animations`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `pick-ui-library`, `prototype`; Matt Pocock: `grill-me`, `grilling`).
- Документация: `README.md`, `BACKLOG.md`, этот `CHANGELOG.md`, `docs/overview.md`, `docs/business-requirements.md`, `docs/system-requirements.md`, `docs/architecture.md`, `docs/design-system.md`.
- Бизнес- и продуктовые требования зафиксированы через интервью `grill-me`: собственная реализация бронирования (без внешних сервисов), Vercel Postgres с защитой от двойной записи, одна локация (Happy Valley/Gresham/Clackamas, OR), только английский язык, каталог услуг/мастеров в JSON, Telegram-уведомления с заделом под WhatsApp, без мультитенантности на v1.
- Каркас Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, деплой предполагается на Vercel.
- Обнаружены и заархивированы (`archive/stitch-mockups/`) готовые Stitch-макеты 4 страниц (Home, Services, Book Your Session, The Roster) и дизайн-система "Gridiron & Groom" — легли в основу `docs/design-system.md` и реализации.
- Дизайн-токены (цвета, типографика Anton/Hanken Grotesk/JetBrains Mono, spacing) перенесены в `src/app/globals.css` (Tailwind v4 `@theme`).
- Контентный слой: `src/data/services.json` (7 услуг, 3 категории), `src/data/masters.json` (3 мастера), `src/data/site-config.json` (контакты-плейсхолдеры, часы работы).
- Страницы: `/` (Home), `/services`, `/team` (The Roster), `/book` (визард бронирования в 4 шага: услуга → мастер → дата/время → контакты).
- Компоненты: `Header`, `Footer`, `ServiceCard`, `MasterCard`, `PortraitPlaceholder` (стилизованная заглушка вместо реальных фото), `BookingWizard`.
- Бэкенд бронирования: схема Drizzle ORM (`src/lib/db/schema.ts`) с уникальным ограничением (мастер, дата, время); `src/lib/business-hours.ts` для генерации тайм-слотов; `POST /api/bookings` и `GET /api/availability`; слой уведомлений `src/lib/notify/*` (Telegram, с точкой расширения под WhatsApp). БД не подключена — код деградирует в понятную ошибку без `POSTGRES_URL`.
- `drizzle.config.ts` и первая миграция `drizzle/0000_left_mandroid.sql`.
- `.env.example` для `POSTGRES_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Git-репозиторий инициализирован, remote `origin` → `git@github.com:ai36/sportscavebarbershop.com.git` (без push).

### Changed

- `package.json#name` → `sportscavebarbershop`; добавлены скрипты `db:generate`/`db:migrate`/`db:studio`.
- `eslint.config.mjs` — `.claude/**` и `archive/**` исключены из линтинга (сторонний контент).
