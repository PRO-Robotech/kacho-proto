# kacho-proto docs-site

Публичная документация контрактов Kachō (Docusaurus 3): каталог доменных API, конвенции
flat-resource + Operations, инфраструктурные контракты (Operation, validation, authz) и инструкции
по `buf` и подключению сгенерированных Go-SDK.

## Локальный запуск

```bash
npm ci
npm start          # dev-сервер с hot-reload
npm run build      # статическая сборка (onBrokenLinks: throw)
npm run serve      # раздать собранный build/
```

## Структура

```
docs/
├── intro.mdx              # что такое kacho-proto
├── getting-started.mdx    # buf, генерация, подключение SDK
├── conventions/           # форма ресурса, naming, ошибки, пагинация, update_mask
├── infra/                 # Operation (LRO), validation, authz, api-gateway
├── domains/               # каталог доменов: overview + iam/vpc/compute/loadbalancer/geo/registry
└── build/                 # buf, сгенерированные SDK
src/
├── css/                   # тема (kacho-ui палитра, AntD-flavored)
└── components/commonBlocks/ApiOperation   # обёртка RPC-операции
```

Навигация задаётся `sidebars.ts`. Факты сверены с `../proto/` (ground-truth: RPC-набор,
message-поля, `google.api.http` REST-пути).

## Сборка образа

```bash
docker build -t kacho-proto-docs:dev .   # nginx со статикой (deploy/default.conf)
```

Helm-чарт статического сайта — в `deploy/`.
