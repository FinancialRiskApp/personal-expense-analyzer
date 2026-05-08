import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function RiskAlertsCard() {
  return (
    <Card className="min-w-[200px] max-w-[380px] min-h-[400px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Alertas de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-evenly gap-4 w-full ">
          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <AlertTriangle />
            </div>
            <div className="w-62">
              <h2>Titulo do alerta</h2>
              <p>mensagem</p>
            </div>
          </div>
          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <AlertCircle />
            </div>
            <div className="w-62">
              <h2>Titulo do alerta</h2>
              <p>mensagem</p>
            </div>
          </div>
          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <AlertCircle />
            </div>
            <div className="w-62">
              <h2>Titulo do alerta</h2>
              <p>mensagem</p>
            </div>
          </div>
          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <Info />
            </div>
            <div className="w-62">
              <h2>Titulo do alerta</h2>
              <p>mensagem</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
