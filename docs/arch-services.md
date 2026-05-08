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
- A maioria das funções recebe uma `string` ISO (`"YYYY-MM-DD"`) e extrai mês/ano internamente.
- `getRemainingDailyBudget()` é a exceção: usa `dayjs()` (data atual) e não recebe parâmetros.

## 3. As 5 funções disponíveis

```ts
import {
  getMonthlyIncome,
  getMonthlyExpenses,
  getMonthBalance,
  getRemainingDailyBudget,
  getDailyBudgetStatus,
} from "@/utils/services";
```

| Função | Exemplo | Retorno |
|---|---|---|
| `getMonthlyIncome("2026-05-08")` | Soma das entradas de Maio/2026 | `number` |
| `getMonthlyExpenses("2026-05-08")` | Soma das saídas de Maio/2026 | `number` |
| `getMonthBalance("2026-05-08")` | Entradas - Saídas de Maio/2026 | `number` |
| `getRemainingDailyBudget()` | Quanto gastar por dia para ficar no orçamento | `number` |
| `getDailyBudgetStatus()` | Status do orçamento diário | `"positivo" \| "equilibrado" \| "negativo"` |

## 4. Exemplo isolado

```ts
import {
  getMonthlyIncome,
  getMonthlyExpenses,
  getMonthBalance,
  getRemainingDailyBudget,
  getDailyBudgetStatus,
} from "@/utils/services";

const income = getMonthlyIncome("2026-05-08");      // 4850
const expenses = getMonthlyExpenses("2026-05-08");  // 3200
const balance = getMonthBalance("2026-05-08");      // 1650

const dailyBudget = getRemainingDailyBudget();       // 86.96
const status = getDailyBudgetStatus();               // "positivo"
```

## 5. Como o mês é extraído

Internamente cada função faz:

```ts
const parsed = dayjs("2026-05-08");
const month = parsed.month() + 1;  // 5
const year = parsed.year();         // 2026
```

O dia do mês é ignorado — apenas **mês** e **ano** são usados para filtrar no repositório.

## 6. Projeção de orçamento diário

`getRemainingDailyBudget()` é diferente das outras funções:

- **Não recebe parâmetros** — usa `dayjs()` (data/hora atual do dispositivo)
- **Leva o dia do mês em consideração** — o cálculo depende de quantos dias já se passaram

### Fórmula

```
orçamentoRestante = receitasDoMes - despesasDoMes
diasRestantes = totalDiasNoMes - diaAtual
resultado = orçamentoRestante / diasRestantes
```

Se `diasRestantes === 0` (último dia do mês), retorna o saldo restante (`receitas - despesas`).

### Interpretação do resultado

| Resultado | Significado |
|---|---|
| `> 0` | Você pode gastar esse valor por dia até o fim do mês |
| `= 0` | Orçamento equilibrado — sem folga |
| `< 0` | Já estourou o orçamento — déficit de `valor × diasRestantes` |

## 7. Classificação do orçamento diário

`getDailyBudgetStatus()` é uma função auxiliar que classifica o resultado de `getRemainingDailyBudget()` em um dos três estados:

| Estado | Condição | Significado |
|---|---|---|
| `"positivo"` | `dailyBudget > 0` | Há folga no orçamento |
| `"equilibrado"` | `dailyBudget === 0` | Receitas e despesas se igualam |
| `"negativo"` | `dailyBudget < 0` | Orçamento já estourou |

Ela não recebe parâmetros e depende exclusivamente de `getRemainingDailyBudget()`.

## 8. Exemplo em um componente React

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

## 9. Regras

- Qualquer string ISO válida funciona: `"2026-05-08"`, `"2026-01-01"`, `"2025-12-31"`
- O dia no ISO é ignorado — apenas **mês** e **ano** são usados para o filtro
- `getRemainingDailyBudget()` é a exceção: não recebe data e considera o **dia atual** no cálculo
