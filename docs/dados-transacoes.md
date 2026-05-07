# Dados de Transacoes

Este projeto usa um arquivo JSON com transacoes financeiras simuladas para alimentar o front-end da aplicacao de analise de risco financeiro.

## O que esses dados representam

O arquivo [database/transactions.json](../database/transactions.json) contem um array de objetos com este formato:

```json
{
  "id": 1,
  "data": "2024-08-02",
  "descricao": "Salario (agosto)",
  "categoria": "Renda",
  "valor": 4280.0,
  "tipo": "entrada"
}
```

Cada registro representa uma movimentacao financeira de uma pessoa fisica. O conjunto foi montado para simular um contexto realista de analise de risco, com:

- salario mensal como unica fonte de entrada;
- despesas recorrentes e variaveis;
- categorias como Moradia, Alimentacao, Transporte, Saude, Lazer, Dividas e Financeiro;
- pelo menos uma transacao por dia no periodo de janeiro de 2025 ate maio de 2026.

Esse perfil ajuda a testar visualizacoes, filtros, indicadores de saldo, comprometimento de renda e comportamento financeiro ao longo do tempo.
