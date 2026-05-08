import { describe, it, expect, vi, afterEach } from "vitest";
import { calculateMonthlyFinancialScore } from "./financialScoreService";

const { mockListTransactions, mockListIncome } = vi.hoisted(() => ({
  mockListTransactions: vi.fn(),
  mockListIncome: vi.fn(),
}));

vi.mock("@/utils/repository", () => ({
  listTransactionsByMonth: mockListTransactions,
  listIncomeTransactionsByMonth: mockListIncome,
}));

const date = "2026-01-15";

function tx(id: number, valor: number, tipo: "entrada" | "saida", categoria: string, descricao?: string) {
  return { id, data: "2026-01-" + String(id).padStart(2, "0"), descricao: descricao ?? `Tx ${id}`, categoria, valor, tipo };
}

function income(id: number, valor: number, categoria?: string) {
  return tx(id, valor, "entrada", categoria ?? "Salário");
}

function expense(id: number, valor: number, categoria: string) {
  return tx(id, valor, "saida", categoria);
}

describe("calculateMonthlyFinancialScore", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns excellent score for healthy finances", () => {
    const incomes = [income(1, 8000), income(2, 2000)];
    const expenses = [expense(3, 1500, "Moradia"), expense(4, 800, "Alimentação"), expense(5, 100, "Serviços")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBe(100);
    expect(result.level).toBe("excelente");
  });

  it("returns good score for moderate finances", () => {
    const incomes = [income(1, 3000)];
    const expenses = [expense(2, 1500, "Moradia"), expense(3, 800, "Alimentação")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBe(81);
    expect(result.level).toBe("bom");
  });

  it("returns attention score for warning signs", () => {
    const incomes = [income(1, 2000)];
    const expenses = [expense(2, 1200, "Moradia"), expense(3, 600, "Alimentação")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBe(67);
    expect(result.level).toBe("atencao");
  });

  it("returns critical score for high risk", () => {
    const incomes = [income(1, 1000)];
    const expenses = [expense(2, 1200, "Moradia"), expense(3, 500, "Alimentação")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBe(29);
    expect(result.level).toBe("critico");
  });

  it("penalizes unusual expenses", () => {
    const incomes = [income(1, 10000)];
    const expenses = [
      expense(2, 100, "Alimentação"),
      expense(3, 1000, "Alimentação"),
      expense(4, 500, "Moradia"),
      expense(5, 2000, "Moradia"),
      expense(6, 50, "Serviços"),
      expense(7, 200, "Serviços"),
    ];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.details.unusualExpensesCount).toBe(3);
    expect(result.details.unusualExpenses).toHaveLength(3);
    expect(result.details.unusualExpenses[0]).toMatchObject({
      id: expect.any(Number),
      categoria: expect.any(String),
      valor: expect.any(Number),
      mediaCategoria: expect.any(Number),
      percentualAcimaDaMedia: expect.any(Number),
    });
    expect(result.score).toBe(77);
  });

  it("penalizes single unusual expense with medium alert", () => {
    const incomes = [income(1, 10000)];
    const expenses = [
      expense(2, 100, "Alimentação"),
      expense(3, 1000, "Alimentação"),
      expense(4, 500, "Moradia"),
    ];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.details.unusualExpensesCount).toBe(1);
    expect(result.details.unusualExpenses).toHaveLength(1);
    expect(result.score).toBe(88);
  });

  it("returns unusual expense with correct fields", () => {
    const incomes = [income(1, 5000)];
    const expenses = [
      expense(2, 50, "Alimentação"),
      expense(3, 200, "Alimentação"),
      expense(4, 1000, "Alimentação"),
    ];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.details.unusualExpenses).toHaveLength(1);

    const unusual = result.details.unusualExpenses[0];
    expect(unusual.id).toBe(4);
    expect(unusual.categoria).toBe("Alimentação");
    expect(unusual.valor).toBe(1000);
    expect(unusual.mediaCategoria).toBeCloseTo(416.67, 1);
    expect(unusual.percentualAcimaDaMedia).toBeCloseTo(140, 0);
  });

  it("handles month with no transactions", () => {
    mockListTransactions.mockReturnValue([]);
    mockListIncome.mockReturnValue([]);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns correct details structure", () => {
    const incomes = [income(1, 5000)];
    const expenses = [expense(2, 2000, "Moradia")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.details).toEqual({
      totalIncome: 5000,
      totalExpenses: 2000,
      balance: 3000,
      expenseRatio: 0.4,
      unusualExpenses: [],
      unusualExpensesCount: 0,
      riskAlertsCount: 1,
    });
  });

  it("clamps minimum score to 0", () => {
    const expenses = [
      expense(1, 10, "CatA"),
      expense(2, 1000, "CatA"),
      expense(3, 10, "CatB"),
      expense(4, 1000, "CatB"),
      expense(5, 10, "CatC"),
      expense(6, 1000, "CatC"),
    ];

    mockListTransactions.mockReturnValue(expenses);
    mockListIncome.mockReturnValue([]);

    const result = calculateMonthlyFinancialScore(date);

    expect(result.score).toBe(0);
    expect(result.level).toBe("critico");
  });

  it("returns score as integer", () => {
    const incomes = [income(1, 1000)];
    const expenses = [expense(2, 650, "Moradia")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(Number.isInteger(result.score)).toBe(true);
  });

  it("includes all required fields in response", () => {
    const incomes = [income(1, 3000)];
    const expenses = [expense(2, 1500, "Moradia")];

    mockListTransactions.mockReturnValue([...incomes, ...expenses]);
    mockListIncome.mockReturnValue(incomes);

    const result = calculateMonthlyFinancialScore(date);

    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("details");
    expect(result.details).toHaveProperty("totalIncome");
    expect(result.details).toHaveProperty("totalExpenses");
    expect(result.details).toHaveProperty("balance");
    expect(result.details).toHaveProperty("expenseRatio");
    expect(result.details).toHaveProperty("unusualExpenses");
    expect(result.details).toHaveProperty("unusualExpensesCount");
    expect(result.details).toHaveProperty("riskAlertsCount");
  });
});
