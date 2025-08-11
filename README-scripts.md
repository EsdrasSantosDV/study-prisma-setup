# Scripts de Geração e Consulta de Dados

Este projeto contém scripts para gerar dados de exemplo e executar consultas avançadas usando Prisma.

## 📁 Estrutura dos Scripts

### 1. `exercicise-one-esdras.ts` - Script Original Corrigido
- **Função**: Gera dados de exemplo para o sistema de vendas (Customer, Product, Order)
- **Recursos**:
  - Cria 2 clientes e 3 produtos
  - Gera 20 pedidos aleatórios
  - Calcula estatísticas de vendas
  - Identifica clientes de alto valor
  - Lista top 5 clientes

### 2. `pedidos-restaurante.ts` - Script de Pedidos de Restaurante
- **Função**: Gera dados de exemplo para o sistema de pedidos de restaurante
- **Recursos**:
  - Cria 50 pedidos aleatórios com status variados
  - 10 pratos diferentes (hambúrgueres, bebidas, sobremesas)
  - 10 clientes fictícios
  - Status: RECEBIDO, PREPARANDO, PRONTO, ENTREGUE
  - Análise por período do dia
  - Estatísticas de pedidos por status

### 3. `consultas-pedidos.ts` - Consultas Avançadas
- **Função**: Executa consultas complexas e análises nos dados de pedidos
- **Recursos**:
  - Pedidos por status específico
  - Análise de tendências por dia da semana
  - Clientes mais frequentes
  - Pratos mais populares
  - Análise de tempo entre pedidos
  - Resumo estatístico completo

## 🚀 Como Executar

### Pré-requisitos
1. Banco de dados PostgreSQL rodando
2. Prisma configurado e sincronizado
3. Dependências instaladas (`npm install`)

### Executar os Scripts

```bash
# 1. Gerar dados de vendas (sistema original)
npx ts-node src/scripts/exercicise-one-esdras.ts

# 2. Gerar dados de pedidos de restaurante
npx ts-node src/scripts/pedidos-restaurante.ts

# 3. Executar consultas avançadas (após gerar dados)
npx ts-node src/scripts/consultas-pedidos.ts
```

## 📊 Modelos de Dados Utilizados

### Sistema de Vendas
- **Customer**: Clientes com nome e email
- **Product**: Produtos com nome e preço
- **Order**: Pedidos com quantidade, total e relacionamentos

### Sistema de Pedidos de Restaurante
- **Pedido**: Pedidos com cliente, status e timestamps
- **PedidoItem**: Itens do pedido com prato e quantidade
- **PedidoStatus**: Enum com status do pedido

## 🔧 Funcionalidades dos Scripts

### Geração de Dados
- Dados aleatórios realistas
- Relacionamentos corretos entre entidades
- Timestamps variados para simular uso real
- Quantidades e valores realistas

### Análises e Consultas
- Agregações com `groupBy`
- Filtros complexos com `having`
- Relacionamentos com `include`
- Ordenação e limitação de resultados
- Cálculos estatísticos

### Relatórios
- Estatísticas gerais
- Rankings e top performers
- Análises temporais
- Resumos por categoria

## 📈 Exemplos de Saída

### Estatísticas de Pedidos
```
📊 Estatísticas dos Pedidos:
Total vendido: R$ 45000
Média por pedido: R$ 2250.00
Menor pedido: R$ 100
Maior pedido: R$ 15000
```

### Análise por Status
```
Pedidos por status:
  RECEBIDO: 15
  PREPARANDO: 8
  PRONTO: 12
  ENTREGUE: 15
```

### Top Clientes
```
🥇 Top 5 Clientes:
João Silva: R$ 8500
Maria Santos: R$ 7200
Pedro Oliveira: R$ 6800
```

## 🛠️ Personalização

### Adicionar Novos Pratos
Edite o array `pratos` em `pedidos-restaurante.ts`:

```typescript
const pratos = [
  { nome: 'Novo Prato', preco: 29.90 },
  // ... outros pratos
];
```

### Modificar Quantidade de Dados
Altere o loop de geração:

```typescript
// Gerar 100 pedidos em vez de 50
for (let i = 0; i < 100; i++) {
  // ... lógica de geração
}
```

### Adicionar Novos Status
Atualize o enum no schema e o array de opções:

```typescript
const statusOptions: PedidoStatus[] = [
  'RECEBIDO', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'
];
```

## 🔍 Troubleshooting

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute `npx prisma db push` para sincronizar o schema

### Erro de Dependências
- Execute `npm install` para instalar dependências
- Verifique se o `@prisma/client` está instalado

### Dados Não Aparecem
- Execute primeiro o script de geração
- Verifique se não há erros de validação
- Use `npx prisma studio` para visualizar o banco

## 📚 Próximos Passos

1. **Adicionar mais modelos**: Funcionários, mesas, horários
2. **Implementar validações**: Verificar dados antes de inserir
3. **Criar testes**: Scripts de teste para validar dados
4. **Exportar dados**: Funcionalidade para exportar relatórios
5. **Interface web**: Dashboard para visualizar estatísticas

## 🤝 Contribuição

Para adicionar novos scripts ou funcionalidades:

1. Crie o arquivo na pasta `src/scripts/`
2. Siga o padrão de nomenclatura
3. Adicione comentários explicativos
4. Teste a execução
5. Atualize este README

---

**Nota**: Estes scripts são para desenvolvimento e testes. Em produção, considere usar seeds oficiais do Prisma e implementar validações adequadas. 