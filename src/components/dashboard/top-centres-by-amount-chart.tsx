import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { BonAPayerSummary } from './datatable';

interface TopCentresByAmountChartProps {
  data: BonAPayerSummary[];
}

export function TopCentresByAmountChart({ data }: TopCentresByAmountChartProps) {
  const centresData = data.reduce((acc, item) => {
    const centreNom = item.centre?.nom || 'Non défini';
    
    if (!acc[centreNom]) {
      acc[centreNom] = {
        nom: centreNom,
        count: 0,
        montantTotal: 0,
      };
    }
    
    acc[centreNom].count += 1;
    acc[centreNom].montantTotal += Number(item.montant) || 0;
    
    return acc;
  }, {} as Record<string, { nom: string; count: number; montantTotal: number }>);

  const chartData = Object.values(centresData)
    .sort((a, b) => b.montantTotal - a.montantTotal)
    .slice(0, 10)
    .map((item, index) => ({
      nom: item.nom.length > 20 ? `${item.nom.substring(0, 20)}...` : item.nom,
      count: item.count,
      montantTotal: item.montantTotal,
      index: index + 1,
    }));

  const chartConfig = {
    montantTotal: {
      label: 'Montant total',
      color: '#00b87a',
    },
  };

  return (
    <Card className='h-full border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
      <CardHeader className='px-3 pt-3 pb-1'>
        <CardTitle className='text-sm font-medium text-primary'>
          💰 Top 10 des centres par montant total
        </CardTitle>
        <CardDescription className='text-xs text-muted-foreground'>
          Classement par montant total des bons à payer
        </CardDescription>
      </CardHeader>
      <CardContent className='px-3 pb-3 pt-1'>
        <ChartContainer config={chartConfig} className='h-[280px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              layout='vertical'
              margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
              <XAxis
                type='number'
                tick={{ fontSize: 12 }}
                stroke='hsl(var(--muted-foreground))'
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;
                  }
                  return new Intl.NumberFormat('fr-FR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value);
                }}
              />
              <YAxis
                type='category'
                dataKey='nom'
                width={75}
                tick={{ fontSize: 10 }}
                stroke='hsl(var(--muted-foreground))'
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  const entry = payload[0] as any;
                  const data = entry.payload;

                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-md'>
                      <div className='font-medium mb-2'>{label}</div>
                      <div className='space-y-1 text-sm'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-full'
                            style={{ backgroundColor: chartConfig.montantTotal.color }}
                          />
                          <span className='text-muted-foreground'>Montant total:</span>
                          <span className='font-medium'>
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'CDF',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(data.montantTotal)}
                          </span>
                        </div>
                        <div className='text-xs text-muted-foreground pt-1'>
                          Nombre de bons: {data.count}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey='montantTotal'
                fill={chartConfig.montantTotal.color}
                radius={[0, 4, 4, 0]}
                name='montantTotal'
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

