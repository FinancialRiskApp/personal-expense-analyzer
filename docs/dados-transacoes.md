# Dados Mockados

Este projeto usa arquivos JSON com dados financeiros simulados para alimentar o front-end da aplicacao de analise de risco financeiro.

## Arquivos disponiveis

- [database/transactions.json](../database/transactions.json): historico de transacoes financeiras.

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

