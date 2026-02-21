import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EvolutionData {
  date: string;
  economySaved: number;
  totalAvoided: number;
}

interface TemporalEvolutionChartProps {
  data: EvolutionData[];
  isLoading?: boolean;
}

export function TemporalEvolutionChart({ data, isLoading }: TemporalEvolutionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Economia</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Economia</CardTitle>
          <CardDescription>Sem dados disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Comece a registrar apostas evitadas para ver sua evolução!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formatar datas para exibição
  const chartData = data.map(item => ({
    ...item,
    dateDisplay: new Date(item.date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    }),
  }));

  const maxEconomy = Math.max(...data.map(d => d.economySaved), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Economia</CardTitle>
        <CardDescription>
          Acompanhe sua economia acumulada ao longo do mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="dateDisplay" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              label={{ value: 'R$', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="economySaved"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Economia Acumulada (R$)"
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Economia Total</p>
            <p className="text-2xl font-bold text-primary">
              R$ {maxEconomy.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Apostas Evitadas</p>
            <p className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.totalAvoided || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
