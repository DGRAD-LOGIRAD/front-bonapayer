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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { parseISO, isValid, parse } from 'date-fns';
import type { BonAPayerSummary } from './datatable';

interface AreaChartProps {
  data: BonAPayerSummary[];
}

export function BonAPayerAreaChart({ data }: AreaChartProps) {
  // Fonction helper pour parser les dates dans différents formats
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    let date: Date;

    try {
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          date = parse(dateString, 'dd/MM/yyyy', new Date());
          if (isValid(date)) {
            return date;
          }
        }
      }

      date = parseISO(dateString);
      if (isValid(date)) {
        return date;
      }

      date = new Date(dateString);
      if (isValid(date) && !isNaN(date.getTime())) {
        return date;
      }

      return null;
    } catch {
      return null;
    }
  };

  const monthlyData = data.reduce((acc, item) => {
    if (!item.createdAt) return acc;

    const date = parseDate(item.createdAt);
    if (!date || !isValid(date)) return acc;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey: monthKey,
        month: month,
        year: year,
        fractionnes: 0,
        nonFractionnes: 0,
      };
    }

    if (item.etat === 1) {
      acc[monthKey].fractionnes += 1;
    } else {
      acc[monthKey].nonFractionnes += 1;
    }

    return acc;
  }, {} as Record<string, { monthKey: string; month: number; year: number; fractionnes: number; nonFractionnes: number }>);

  const moisAbrev: Record<number, string> = {
    1: 'jan',
    2: 'fev',
    3: 'mar',
    4: 'avr',
    5: 'mai',
    6: 'jun',
    7: 'jul',
    8: 'aoû',
    9: 'sep',
    10: 'oct',
    11: 'nov',
    12: 'déc',
  };

  const dataExistantes = Object.values(monthlyData).sort((a, b) => {
    return a.monthKey.localeCompare(b.monthKey);
  });

  const annees = dataExistantes.length > 0
    ? [...new Set(dataExistantes.map(item => item.monthKey.split('-')[0]))].sort()
    : [];

  const titreAnnee = annees.length === 1
    ? annees[0]
    : annees.length > 1
    ? `${annees[0]} - ${annees[annees.length - 1]}`
    : '';

  const anneeReference = annees.length > 0 ? parseInt(annees[annees.length - 1]) : new Date().getFullYear();
  const dataMap = new Map(dataExistantes.map(item => [item.monthKey, item]));

  let chartData = [];

  for (let mois = 1; mois <= 12; mois++) {
    const monthKey = `${anneeReference}-${String(mois).padStart(2, '0')}`;
    const monthLabel = moisAbrev[mois];
    const dataExistant = dataMap.get(monthKey);

    chartData.push({
      month: monthLabel,
      monthKey: monthKey,
      fractionnes: dataExistant ? dataExistant.fractionnes : 0,
      nonFractionnes: dataExistant ? dataExistant.nonFractionnes : 0,
    });
  }

  const chartConfig = {
    fractionnes: {
      label: 'Fractionnés',
      color: '#00b87a',
    },
    nonFractionnes: {
      label: 'Non fractionnés',
      color: '#f7b928',
    },
  };

  return (
    <Card className='h-full border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
      <CardHeader className='px-3 pt-3 pb-1'>
        <CardTitle className='text-sm font-medium text-primary'>
          📊 Volume de bons à payer par état {titreAnnee && `(${titreAnnee})`}
        </CardTitle>
        <CardDescription className='text-xs text-muted-foreground'>
          Nombre de bons par mois - Fractionnés vs Non fractionnés
        </CardDescription>
      </CardHeader>
      <CardContent className='px-3 pb-3 pt-1'>
        <ChartContainer config={chartConfig} className='h-[280px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 11 }}
                stroke='hsl(var(--muted-foreground))'
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke='hsl(var(--muted-foreground))'
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-md'>
                      <div className='font-medium mb-2'>{label}</div>
                      <div className='space-y-1 text-sm'>
                        {payload.map((entry: any, index: number) => {
                          const value = typeof entry.value === 'number' ? entry.value : 0;
                          const labelText = entry.dataKey === 'fractionnes' ? 'Fractionnés' : 'Non fractionnés';

                          return (
                            <div key={index} className='flex items-center gap-2'>
                              <div
                                className='h-3 w-3 rounded-full'
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className='text-muted-foreground'>{labelText}:</span>
                              <span className='font-medium'>{value} bons</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => {
                  if (value === 'fractionnes') return '✅ Fractionnés';
                  if (value === 'nonFractionnes') return '⏳ Non fractionnés';
                  return value;
                }}
              />
              <Area
                type='monotone'
                dataKey='fractionnes'
                stackId='1'
                stroke={chartConfig.fractionnes.color}
                fill={chartConfig.fractionnes.color}
                fillOpacity={0.6}
                name='fractionnes'
              />
              <Area
                type='monotone'
                dataKey='nonFractionnes'
                stackId='1'
                stroke={chartConfig.nonFractionnes.color}
                fill={chartConfig.nonFractionnes.color}
                fillOpacity={0.6}
                name='nonFractionnes'
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

