import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncomePage() {
  return (
    <section className="space-y-6">
      <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <CardHeader>
          <CardTitle>Renda</CardTitle>
          <CardDescription>
            Esta tela vai concentrar seus lançamentos de entrada e o resumo dos recebimentos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-sm text-slate-500">
            Espaço reservado para a listagem e gestão das entradas financeiras.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
