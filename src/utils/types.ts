export interface Transaction {
  id: number
  data: string
  descricao: string
  categoria: Categoria
  valor: number
  tipo: 'entrada' | 'saida'
}

export type Categoria =
  | 'Renda'
  | 'Moradia'
  | 'Alimentação'
  | 'Lazer'
  | 'Saúde'
  | 'Transporte'
  | 'Educação'
  | 'Poupança'
  | 'Outros'

export type NivelRisco = 'alto' | 'medio' | 'baixo'
export type Severidade = 'critico' | 'atencao' | 'info'

export interface FinancialScore {
  valor: number
  nivel: NivelRisco
  detalhes: {
    pontosSaldo: number
    descontosAlertas: number
    descontosVariacao: number
  }
}

export interface SaldoMensal {
  mes: string
  totalEntradas: number
  totalSaidas: number
  saldo: number
  projetado: boolean
}

export interface MonthlyBalanceProjection {
  referenceDate: string
  elapsedDaysInMonth: number
  totalDaysInMonth: number
  totalExpensesInPeriod: number
  averageDailyExpenses: number
  projectedTotalExpenses: number
  projectedBalance: number
  requiredBalance: number
}

export interface RiskAlert {
  id: number
  categoria: Categoria
  mensagem: string
  severidade: Severidade
  valorAtual: number
  valorMedio: number
  percentualAcima: number
}

export interface RiskProfile {
  score: FinancialScore
  alertas: RiskAlert[]
  historicoDeSaldo: SaldoMensal[]
  totalAlertas: number
  mesComMaiorRisco: string
}
