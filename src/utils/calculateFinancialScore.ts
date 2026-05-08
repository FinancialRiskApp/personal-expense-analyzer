import { detectUnusualExpenses, type Transaction } from "./detectUnusualExpenses";
import { generateRiskAlerts, type RiskAlert } from "./generateRiskAlerts";

export type FinancialScore = {
  score: number;
  nivel: "excelente" | "bom" | "atencao" | "critico";
  titulo: string;
  mensagem: string;
  detalhes: {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    percentualGastos: number;
    quantidadeGastosForaPadrao: number;
    quantidadeAlertasRisco: number;
  };
};

export function calculateFinancialScore(
  transactions: Transaction[],
  rendaMensal?: number,
): FinancialScore {
  const receitas = transactions.filter((transaction) => transaction.tipo === "entrada");

  const totalReceitasJson = receitas.reduce((soma, transaction) => soma + transaction.valor, 0);

  const totalReceitas = rendaMensal && rendaMensal > 0 ? rendaMensal : totalReceitasJson;

  const despesas = transactions.filter((transaction) => transaction.tipo === "saida");

  const totalDespesas = despesas.reduce((soma, transaction) => soma + transaction.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const percentualGastos = totalReceitas > 0 ? totalDespesas / totalReceitas : 1;

  const gastosForaPadrao = detectUnusualExpenses(transactions);

  const alertasRisco: RiskAlert[] = generateRiskAlerts(transactions);

  const alertasRiscoAlto = alertasRisco.filter((alerta) => alerta.nivel === "alto").length;

  const alertasRiscoMedio = alertasRisco.filter((alerta) => alerta.nivel === "médio").length;

  let score = 100;

  if (saldo < 0) {
    score -= 30;
  }

  if (percentualGastos >= 0.9) {
    score -= 25;
  } else if (percentualGastos >= 0.75) {
    score -= 15;
  } else if (percentualGastos >= 0.6) {
    score -= 8;
  }

  if (gastosForaPadrao.length >= 3) {
    score -= 15;
  } else if (gastosForaPadrao.length > 0) {
    score -= 8;
  }

  score -= alertasRiscoAlto * 8;
  score -= alertasRiscoMedio * 4;

  if (totalReceitas === 0 && totalDespesas > 0) {
    score -= 20;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const scoreInfo = getScoreInfo(score);

  return {
    score,
    nivel: scoreInfo.nivel,
    titulo: scoreInfo.titulo,
    mensagem: scoreInfo.mensagem,
    detalhes: {
      totalReceitas,
      totalDespesas,
      saldo,
      percentualGastos,
      quantidadeGastosForaPadrao: gastosForaPadrao.length,
      quantidadeAlertasRisco: alertasRisco.length,
    },
  };
}

function getScoreInfo(score: number): {
  nivel: "excelente" | "bom" | "atencao" | "critico";
  titulo: string;
  mensagem: string;
} {
  if (score >= 85) {
    return {
      nivel: "excelente",
      titulo: "Excelente saúde financeira",
      mensagem:
        "O usuário apresenta bom equilíbrio entre receitas, despesas e baixo nível de risco financeiro.",
    };
  }

  if (score >= 70) {
    return {
      nivel: "bom",
      titulo: "Boa saúde financeira",
      mensagem:
        "O usuário apresenta uma situação financeira positiva, mas ainda pode otimizar alguns gastos.",
    };
  }

  if (score >= 50) {
    return {
      nivel: "atencao",
      titulo: "Atenção financeira necessária",
      mensagem: "O usuário apresenta sinais de alerta e deve acompanhar melhor seus gastos.",
    };
  }

  return {
    nivel: "critico",
    titulo: "Risco financeiro elevado",
    mensagem:
      "O usuário apresenta alto risco financeiro, com necessidade de revisão urgente das despesas.",
  };
}
