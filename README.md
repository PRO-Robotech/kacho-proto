# kacho-proto

Единственный дом всех `.proto` контрактов Kachō. Доменные API (`kacho/cloud/<domain>/v1/`)
и универсальная инфраструктура (`operation`, `validation`, `apigateway`, `api`,
`iam/authz`) + вендоренные canonical `google/*`. Сгенерированные Go-stubs коммитятся в
`gen/go/...` и импортируются всеми сервисами как
`github.com/PRO-Robotech/kacho-proto/gen/go/kacho/cloud/<domain>/v1`.

## Домены
`iam` · `vpc` (+`reference`) · `loadbalancer` (nlb) · `compute` (+`access`,`maintenance`) ·
`geo` · `registry` · `apigateway`.

## Сборка
```
cd proto && buf lint && buf generate   # → ../gen/go
go build ./...
```
Единый `buf lint`/`buf breaking` на весь контракт; синхронные версии, готовые SDK.
