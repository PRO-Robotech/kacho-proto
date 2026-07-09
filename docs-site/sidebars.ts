import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  protoSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Конвенции',
      collapsed: false,
      items: [
        'conventions/resource-shape',
        'conventions/naming',
        'conventions/errors',
        'conventions/pagination-filter',
        'conventions/update-mask',
      ],
    },
    {
      type: 'category',
      label: 'Инфраструктурные контракты',
      collapsed: false,
      items: ['infra/operation', 'infra/validation', 'infra/authz', 'infra/apigateway'],
    },
    {
      type: 'category',
      label: 'Домены',
      collapsed: false,
      items: [
        'domains/overview',
        'domains/iam',
        'domains/vpc',
        'domains/compute',
        'domains/loadbalancer',
        'domains/geo',
        'domains/registry',
      ],
    },
    {
      type: 'category',
      label: 'Сборка и SDK',
      collapsed: true,
      items: ['build/buf', 'build/generated-stubs'],
    },
  ],
}

export default sidebars
