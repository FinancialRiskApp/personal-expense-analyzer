import dayjs from "dayjs";
import rawData from "../../database/transactions.json";
import type { Transaction } from "@/utils/types";

export function getTransactions(): Transaction[] {
  return rawData as Transaction[];
}

export function getCurrentMonthSalary(transactions: Transaction[]){
  const currentDate = dayjs();
  const currentIncome = transactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.data);

    return (
      transaction.tipo === "entrada" &&
      transactionDate.month() === currentDate.month() &&
      transactionDate.year() === currentDate.year()
    );
  });
  return currentIncome[0].valor;
}
