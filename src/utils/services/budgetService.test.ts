import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRemainingDailyBudget, getDailyBudgetStatus } from "./budgetService";

const { mockListIncome, mockListExpense } = vi.hoisted(() => ({
  mockListIncome: vi.fn(),
  mockListExpense: vi.fn(),
}));

vi.mock("@/utils/repository", () => ({
  listIncomeTransactionsByMonth: mockListIncome,
  listExpenseTransactionsByMonth: mockListExpense,
}));

describe("getRemainingDailyBudget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("returns how much can be spent per day for the rest of the month", () => {
    vi.setSystemTime(new Date(2026, 4, 8));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 1000 }]);

    const result = getRemainingDailyBudget();

    expect(result).toBeCloseTo(86.96, 1);
  });

  it("returns remaining balance on the last day of the month", () => {
    vi.setSystemTime(new Date(2026, 4, 31));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 2900 }]);

    const result = getRemainingDailyBudget();

    expect(result).toBe(100);
  });

  it("returns negative value when already over budget", () => {
    vi.setSystemTime(new Date(2026, 4, 8));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 3500 }]);

    const result = getRemainingDailyBudget();

    expect(result).toBeCloseTo(-21.74, 1);
  });

  it("returns zero when income equals expenses on first day", () => {
    vi.setSystemTime(new Date(2026, 4, 1));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 3000 }]);

    const result = getRemainingDailyBudget();

    expect(result).toBe(0);
  });

  it("handles month with no transactions", () => {
    vi.setSystemTime(new Date(2026, 4, 15));
    mockListIncome.mockReturnValue([]);
    mockListExpense.mockReturnValue([]);

    const result = getRemainingDailyBudget();

    expect(result).toBe(0);
  });
});

describe("getDailyBudgetStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns "positivo" when there is a positive daily budget', () => {
    vi.setSystemTime(new Date(2026, 4, 8));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 1000 }]);

    const result = getDailyBudgetStatus();

    expect(result).toBe("positivo");
  });

  it('returns "equilibrado" when budget is balanced', () => {
    vi.setSystemTime(new Date(2026, 4, 1));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 3000 }]);

    const result = getDailyBudgetStatus();

    expect(result).toBe("equilibrado");
  });

  it('returns "negativo" when already over budget', () => {
    vi.setSystemTime(new Date(2026, 4, 8));
    mockListIncome.mockReturnValue([{ valor: 3000 }]);
    mockListExpense.mockReturnValue([{ valor: 3500 }]);

    const result = getDailyBudgetStatus();

    expect(result).toBe("negativo");
  });
});
