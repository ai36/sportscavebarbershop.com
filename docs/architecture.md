# Архитектура

## Обзор

Next.js 16 App Router моноприложение: статические маркетинговые страницы + один API-слой для бронирования. Без отдельного бэкенд-сервиса — вся серверная логика живёт в Next.js route handlers, деплой единым проектом на Vercel.

```
Browser
  │
  ├─ /, /services, /team        → статические React Server Components,
  │                                читают src/data/*.json напрямую (build-time)
  │
  ├─ /book                      → BookingWizard (client component)
  │                                fetch → /api/availability, /api/bookings
  │
  └─ /api/availability (GET)    → src/lib/business-hours.ts (часы салона)
     /api/bookings (POST)         + Drizzle → Vercel Postgres (занятые слоты)
                                   → src/lib/notify → Telegram Bot API
```

## Слои и где что лежит

| Слой                       | Путь                                                                           | Заметки                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Контентный каталог         | `src/data/services.json`, `src/data/masters.json`, `src/data/site-config.json` | Источник правды для услуг/мастеров/контактов сайта. Редактируется разработчиком + деплой (см. [business-requirements.md](./business-requirements.md)) |
| Типы                       | `src/lib/types.ts`                                                             | `Service`, `Master`, `SiteConfig`                                                                                                                     |
| Дизайн-токены              | `src/app/globals.css` (`@theme`)                                               | Портированы из `archive/stitch-mockups/gridiron_groom/DESIGN.md`, см. [design-system.md](./design-system.md)                                          |
| UI-компоненты              | `src/components/*`                                                             | `Header`, `Footer`, `ServiceCard`, `MasterCard`, `PortraitPlaceholder`, `BookingWizard`                                                               |
| Бизнес-логика бронирования | `src/lib/business-hours.ts`                                                    | Генерирует доступные тайм-слоты из `site-config.json#hours`                                                                                           |
| БД                         | `src/lib/db/schema.ts`, `src/lib/db/client.ts`                                 | Drizzle ORM, Neon serverless driver, `getDb()` — ленивая инициализация                                                                                |
| Уведомления                | `src/lib/notify/*`                                                             | `notifyNewBooking()` — точка расширения под WhatsApp (см. комментарий в `notify/index.ts`)                                                            |
| API                        | `src/app/api/availability/route.ts`, `src/app/api/bookings/route.ts`           | Единственные два серверных эндпоинта проекта                                                                                                          |

## Бронирование: почему так

- **Без внешнего booking-сервиса** — осознанное решение заказчика: полный контроль над UX и данными, никакой зависимости/оплаты стороннего SaaS.
- **Vercel Postgres вместо "без БД"**: заказчик прямо потребовал физическую невозможность двойного бронирования — этого нельзя гарантировать без БД с уникальным ограничением на уровне транзакции. Neon serverless driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`) выбран как HTTP-driver, совместимый с serverless/edge-рантаймом Vercel (не держит долгоживущих TCP-соединений, чего требовал бы обычный `pg`).
- **`getDb()` — ленивая инициализация**, а не подключение на верхнем уровне модуля: страницы (`/`, `/services`, `/team`) не импортируют БД вообще, поэтому `next build` и статическая генерация работают даже без единой переменной окружения. БД трогают только два route handler'а.

### Известные упрощения v1

- **Слот = точное время, не интервал.** Уникальность проверяется по тройке (мастер, дата, время), а не по пересечению `[время, время+длительность_услуги)`. На практике это значит: если мастер занят 45-минутной стрижкой с 10:00, система формально не помешает записать его же на 10:15 отдельным клиентом (разные точные "время"). Для MVP с демо-данными это допустимо; для реального запуска — дописать overlap-проверку в `POST /api/bookings` (транзакция с блокировкой диапазона) прежде, чем доверять сайту реальных клиентов. Зафиксировано в [BACKLOG.md](../BACKLOG.md).
- **Единые часы салона для всех мастеров** — нет модели индивидуального расписания/отпусков по мастеру (сознательное решение заказчика на v1).
- **Нет отмены/переноса брони** — не входит в v1.

## Дизайн-система

Портирована из готовых Stitch-макетов (`archive/stitch-mockups/`), не придумана с нуля — см. [design-system.md](./design-system.md) за полным описанием токенов и сверкой брендинга.

## Деплой

Целевая платформа — Vercel; проект в Vercel ещё не создан. Порядок подключения:

1. `vercel link` (или через дашборд) — привязать репозиторий к Vercel-проекту.
2. Storage → Postgres — создать инстанс, скопировать `POSTGRES_URL` в `.env.local` и в Vercel env vars.
3. `npm run db:generate` (уже сделано, см. `drizzle/0000_*.sql`) → `npm run db:migrate` — применить схему к реальной БД.
4. Создать Telegram-бота через @BotFather, заполнить `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`.
5. `vercel deploy`.

## Что не сделано (архитектурно значимое)

- Реальный Postgres-инстанс не создан — код готов, не протестирован против живой БД.
- Google Analytics не подключена.
- Rate limiting на `/api/bookings` отсутствует.
- Изображения — стилизованные плейсхолдеры, не реальные фото (см. `PortraitPlaceholder`).
