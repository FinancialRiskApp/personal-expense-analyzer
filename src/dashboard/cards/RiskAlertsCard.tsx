import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

import type { RiskAlert } from "@/utils/generateRiskAlerts";

type RiskAlertsCardProps = {
  alerts: RiskAlert[];
};

function getAlertIcon(nivel: RiskAlert["nivel"]) {
  if (nivel === "alto") {
    return <AlertCircle className="text-red-500" />;
  }

  if (nivel === "médio") {
    return <AlertTriangle className="text-yellow-500" />;
  }

  return <Info className="text-blue-500" />;
}

export default function RiskAlertsCard({ alerts }: RiskAlertsCardProps) {
  return (
    <Card className="min-w-[200px] max-w-[380px] min-h-[400px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Alertas de Risco</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col justify-evenly gap-4 w-full">
          {alerts.length === 0 ? (
            <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
              <div className="flex items-center justify-center w-10">
                <Info className="text-blue-500" />
              </div>

              <div className="w-62">
                <h2 className="font-semibold">Nenhum alerta identificado</h2>
                <p className="text-sm text-muted-foreground">
                  Não foram encontrados riscos relevantes no período analisado.
                </p>
              </div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm"
              >
                <div className="flex items-center justify-center w-10">
                  {getAlertIcon(alert.nivel)}
                </div>

                <div className="w-62">
                  <h2 className="font-semibold">{alert.titulo}</h2>
                  <p className="text-sm text-muted-foreground">{alert.mensagem}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
