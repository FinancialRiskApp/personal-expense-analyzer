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

---

## 10. Serviço de Score Financeiro — `financialScoreService`

Gera uma pontuação mensal de saúde financeira (0–100) a partir das transações de um mês, incluindo despesas incomuns e alertas de risco.

```ts
import { calculateMonthlyFinancialScore } from "@/utils/services";
```

### 10.1. Estrutura de retorno — `MonthlyFinancialScore`

```ts
type MonthlyFinancialScore = {
  score: number;                              // 0 – 100
  level: "excelente" | "bom" | "atencao" | "critico";
  title: string;                              // Título amigável
  message: string;                            // Descrição contextual
  details: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expenseRatio: number;                     // despesas / receitas
    unusualExpenses: UnusualExpense[];        // 🎯 gastos fora do padrão
    unusualExpensesCount: number;
    riskAlertsCount: number;
  };
};
```

### 10.2. Tipo `UnusualExpense` (destaque)

Cada item do array `unusualExpenses` contém:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `number` | ID original da transação |
| `data` | `string` | Data ISO da transação |
| `descricao` | `string` | Descrição do gasto |
| `categoria` | `string` | Categoria (ex: "Alimentação") |
| `valor` | `number` | Valor do gasto |
| `mediaCategoria` | `number` | Média dos gastos na mesma categoria no mês |
| `percentualAcimaDaMedia` | `number` | % acima da média (`>= 50` para ser considerado incomum) |

Uma despesa é considerada **incomum** quando seu valor supera a média da categoria em **50% ou mais**.

```ts
// Exemplo de retorno típico
unusualExpenses: [
  {
    id: 42,
    data: "2026-01-15",
    descricao: "Jantar especial",
    categoria: "Alimentação",
    valor: 1000,
    mediaCategoria: 250,
    percentualAcimaDaMedia: 300,   // 300% acima da média
  },
];
```

### 10.3. Como a pontuação é calculada

A base é **100 pontos**, com descontos progressivos:

| Condição | Desconto |
|---|---|
| Saldo negativo | −30 |
| `expenseRatio >= 0.9` | −25 |
| `expenseRatio >= 0.75` | −15 |
| `expenseRatio >= 0.6` | −8 |
| 3+ despesas incomuns | −15 |
| 1–2 despesas incomuns | −8 |
| Alerta de nível "alto" | −8 cada |
| Alerta de nível "médio" | −4 cada |
| Renda zero com despesas > 0 | −20 |

O score é truncado entre 0 e 100, e arredondado para inteiro.

### 10.4. Níveis de classificação

| Faixa | Level | Título |
|---|---|---|
| >= 85 | `excelente` | Excelente saúde financeira |
| 70 – 84 | `bom` | Boa saúde financeira |
| 50 – 69 | `atencao` | Atenção financeira necessária |
| < 50 | `critico` | Risco financeiro elevado |

---

## 11. Exemplos React com `unusualExpenses`

### 11.1. Card do score financeiro

```tsx
import { useMemo } from "react";
import { calculateMonthlyFinancialScore } from "@/utils/services";

type Props = { selectedDate: string };

const LEVEL_COLORS: Record<string, string> = {
  excelente: "#22c55e",
  bom: "#3b82f6",
  atencao: "#f59e0b",
  critico: "#ef4444",
};

export default function FinancialScoreCard({ selectedDate }: Props) {
  const financialScore = useMemo(
    () => calculateMonthlyFinancialScore(selectedDate),
    [selectedDate],
  );

  return (
    <div
      style={{
        borderLeft: `4px solid ${LEVEL_COLORS[financialScore.level]}`,
        padding: "1rem",
      }}
    >
      <h2>{financialScore.title}</h2>
      <p>{financialScore.message}</p>

      <p>
        Pontuação: <strong>{financialScore.score}</strong> / 100
      </p>

      <p>
        Receitas: R$ {financialScore.details.totalIncome.toFixed(2)} |{" "}
        Despesas: R$ {financialScore.details.totalExpenses.toFixed(2)} |{" "}
        Saldo: R$ {financialScore.details.balance.toFixed(2)}
      </p>
    </div>
  );
}
```

### 11.2. Lista de despesas incomuns

```tsx
import { useMemo } from "react";
import { calculateMonthlyFinancialScore } from "@/utils/services";

type Props = { selectedDate: string };

export default function UnusualExpensesList({ selectedDate }: Props) {
  const { details } = useMemo(
    () => calculateMonthlyFinancialScore(selectedDate),
    [selectedDate],
  );

  if (details.unusualExpenses.length === 0) {
    return <p>Nenhuma despesa incomum neste mês.</p>;
  }

  return (
    <div>
      <h3>
        Despesas incomuns ({details.unusualExpensesCount})
      </h3>

      <ul>
        {details.unusualExpenses.map((expense) => (
          <li key={expense.id}>
            <strong>{expense.descricao}</strong> —{" "}
            R$ {expense.valor.toFixed(2)}
            <br />
            <small>
              {expense.categoria} | Média da categoria: R$ {expense.mediaCategoria.toFixed(2)} |{" "}
              {expense.percentualAcimaDaMedia.toFixed(0)}% acima da média
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 11.3. Dashboard completo com score + despesas incomuns + alertas

```tsx
import { useMemo } from "react";
import { calculateMonthlyFinancialScore } from "@/utils/services";

type Props = { selectedDate: string };

export default function FinancialDashboard({ selectedDate }: Props) {
  const score = useMemo(
    () => calculateMonthlyFinancialScore(selectedDate),
    [selectedDate],
  );

  const { details } = score;

  return (
    <div>
      {/* Score principal */}
      <div>
        <h1>
          {score.level === "excelente" && "🟢"}
          {score.level === "bom" && "🔵"}
          {score.level === "atencao" && "🟡"}
          {score.level === "critico" && "🔴"}{" "}
          {score.title}
        </h1>
        <p>{score.message}</p>

        <p>
          <strong>Pontuação:</strong> {score.score}/100
        </p>
      </div>

      {/* Métricas */}
      <div>
        <p>Receitas: R$ {details.totalIncome.toFixed(2)}</p>
        <p>Despesas: R$ {details.totalExpenses.toFixed(2)}</p>
        <p>Saldo: R$ {details.balance.toFixed(2)}</p>
        <p>
          Comprometimento da renda:{" "}
          {(details.expenseRatio * 100).toFixed(0)}%
        </p>
      </div>

      {/* Despesas incomuns */}
      <div>
        <h3>
          Despesas fora do padrão: {details.unusualExpensesCount}
        </h3>

        {details.unusualExpenses.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Categoria</th>
                <th>Média da cat.</th>
                <th>% acima</th>
              </tr>
            </thead>
            <tbody>
              {details.unusualExpenses.map((ue) => (
                <tr key={ue.id}>
                  <td>{ue.descricao}</td>
                  <td>R$ {ue.valor.toFixed(2)}</td>
                  <td>{ue.categoria}</td>
                  <td>R$ {ue.mediaCategoria.toFixed(2)}</td>
                  <td>{ue.percentualAcimaDaMedia.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {details.unusualExpenses.length === 0 && (
          <p>Nenhuma despesa fora do padrão identificada.</p>
        )}
      </div>

      {/* Quantidade de alertas */}
      <div>
        <p>Alertas de risco: {details.riskAlertsCount}</p>
      </div>
    </div>
  );
}
```

---

## 12. Boas práticas com `unusualExpenses`

### Consumir o dado uma vez só

Chame `calculateMonthlyFinancialScore` uma única vez e desestruture o `details`:

```ts
const result = calculateMonthlyFinancialScore(date);
const { unusualExpenses, score, level } = result;
```

### Filtrar por categoria

```ts
const alimentacaoIncomum = details.unusualExpenses.filter(
  (ue) => ue.categoria === "Alimentação",
);
```

### Ordenar por mais discrepante

```ts
const ordenado = [...details.unusualExpenses].sort(
  (a, b) => b.percentualAcimaDaMedia - a.percentualAcimaDaMedia,
);
```

### Exibir badge de risco

```ts
function UnusualExpenseBadge({ percentual }: { percentual: number }) {
  const color =
    percentual >= 200 ? "red" :
    percentual >= 100 ? "orange" :
    "yellow";

  return <span style={{ background: color, padding: "2px 8px", borderRadius: 4 }}>
    {percentual.toFixed(0)}% acima da média
  </span>;
}
```

---

## 13. Regras do serviço de score

- O parâmetro é uma string ISO `"YYYY-MM-DD"` — o dia é ignorado, apenas **mês** e **ano** são usados
- O score é **sempre** um inteiro entre 0 e 100
- Despesas incomuns são detectadas automaticamente quando o valor fica **≥ 50% acima da média** da categoria
- Alertas de risco são gerados a partir de condições como saldo negativo, gastos próximos da renda e múltiplas despesas incomuns
