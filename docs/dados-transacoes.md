# Dados Mockados

Este projeto usa arquivos JSON com dados financeiros simulados para alimentar o front-end da aplicacao de analise de risco financeiro.

## Arquivos disponiveis

- [database/transactions.json](../database/transactions.json): historico de transacoes financeiras.
- [database/score-history.json](../database/score-history.json): historico mensal de score.
- [database/goals.json](../database/goals.json): metas financeiras.

## O que representam as transacoes

O arquivo `transactions.json` contem um array de objetos neste formato:

```json
{
  "id": 1,
  "data": "2025-01-05",
  "descricao": "Salario CLT (janeiro/2025)",
  "categoria": "Renda",
  "valor": 4850,
  "tipo": "entrada"
}
```

Cada registro representa uma movimentacao financeira de uma pessoa fisica. O conjunto foi montado para simular um contexto realista de analise de risco, com:

- salario mensal como unica fonte de entrada;
- despesas recorrentes e variaveis;
- pelo menos uma transacao por dia no periodo de janeiro de 2025 ate maio de 2026;
- categorias padronizadas para facilitar filtros e dashboards.

As categorias usadas no mock seguem exatamente este padrao:

- `Renda`
- `Moradia`
- `Alimentação`
- `Lazer`
- `Saúde`
- `Transporte`
- `Educação`
- `Poupança`
- `Outros`

Esse perfil ajuda a testar visualizacoes, filtros por periodo, saldo mensal, distribuicao por categoria, comprometimento de renda e sinais de risco financeiro.

## O que representa o historico de score

O arquivo `score-history.json` traz um registro por mes para toda a mesma faixa coberta pelo mock de transacoes, de janeiro de 2025 ate maio de 2026.

## O que representam as metas

O arquivo `goals.json` contem metas financeiras associadas a categorias como `Poupança`, `Lazer` e `Educação`.

## Camada local de transacoes

Nesta branch, a persistencia de transacoes passa a usar `localStorage` no navegador, sem API ou backend.

- `database/transactions.json` continua sendo a seed inicial do historico.
- a chave usada no navegador e `pea.transactions`.
- a fonte de verdade em runtime passa a ser o `localStorage`.
- entradas e saidas permanecem no mesmo array e sao diferenciadas por `tipo`.

O acesso aos dados fica centralizado em `src/utils/transactionsRepository.ts`, com funcoes para:

- inicializar a store local;
- listar transacoes por mes;
- listar entradas e saidas por mes;
- calcular resumo mensal;
- criar, atualizar e remover transacoes;
- restaurar a seed original quando necessario.

Regras desta camada:

- `createTransaction` e `updateTransaction` assumem payload ja validado pelos formularios com `zod`;
- `getTransactionById` e `deleteTransaction` fazem validacao simples de `id`;
- se o valor salvo no `localStorage` estiver ausente, invalido ou corrompido, a seed original e restaurada automaticamente.
