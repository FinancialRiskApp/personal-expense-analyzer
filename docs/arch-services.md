# Camada de Serviços — Cálculos Financeiros

## 1. Arquitetura em camadas

```
 Pages / Components
         ↓  importa
     Services       ← processa / calcula
         ↓  importa
    Repository      ← filtra / lista dados
         ↓
  localStorage
```

## 2. Responsabilidade

- **Services** processam e calculam dados financeiros.
- **Repository** filtra e retorna transações brutas.
- Services **nunca** acessam `localStorage` diretamente — sempre usam o repository.
- Toda função recebe uma `string` no formato ISO (`"YYYY-MM-DD"`) e extrai mês/ano internamente.

## 3. As 3 funções disponíveis

```ts
import { getMonthlyIncome, getMonthlyExpenses, getMonthBalance } from "@/utils/services";
```

| Função | Exemplo | Retorno |
|---|---|---|
| `getMonthlyIncome("2026-05-08")` | Soma das entradas de Maio/2026 | `number` |
| `getMonthlyExpenses("2026-05-08")` | Soma das saídas de Maio/2026 | `number` |
| `getMonthBalance("2026-05-08")` | Entradas - Saídas de Maio/2026 | `number` |

## 4. Exemplo isolado

```ts
import { getMonthlyIncome, getMonthlyExpenses, getMonthBalance } from "@/utils/services";

const income = getMonthlyIncome("2026-05-08");      // 4850
const expenses = getMonthlyExpenses("2026-05-08");  // 3200
const balance = getMonthBalance("2026-05-08");      // 1650
```

## 5. Como o mês é extraído

Internamente cada função faz:

```ts
const parsed = dayjs("2026-05-08");
const month = parsed.month() + 1;  // 5
const year = parsed.year();         // 2026
```

O dia do mês é ignorado — apenas **mês** e **ano** são usados para filtrar no repositório.

## 6. Exemplo em um componente React

```tsx
import { useState } from "react";
import { getMonthlyIncome, getMonthlyExpenses, getMonthBalance } from "@/utils/services";

export default function MonthSummary() {
  const [selectedDate, setSelectedDate] = useState("2026-05-01");

  const income = getMonthlyIncome(selectedDate);
  const expenses = getMonthlyExpenses(selectedDate);
  const balance = getMonthBalance(selectedDate);

  return (
    <div>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <p>Receitas: R$ {income.toFixed(2)}</p>
      <p>Despesas: R$ {expenses.toFixed(2)}</p>
      <p>Saldo: R$ {balance.toFixed(2)}</p>
    </div>
  );
}
```

### Fluxo do exemplo

1. `<input type="date">` retorna uma string `"YYYY-MM-DD"` (ISO)
2. O estado `selectedDate` guarda esse valor
3. As 3 funções do serviço recebem a string, extraem mês/ano e retornam os totais
4. O componente apenas consome os números — não precisa saber como mês/ano são extraídos

## 7. Regras

- Qualquer string ISO válida funciona: `"2026-05-08"`, `"2026-01-01"`, `"2025-12-31"`
- O dia no ISO é ignorado — apenas **mês** e **ano** são usados para o filtro
