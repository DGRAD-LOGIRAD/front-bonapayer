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
import { parseISO, isValid, parse } from 'date-fns';
import type { BonAPayerSummary } from './datatable';

interface BarChartProps {
  data: BonAPayerSummary[];
  devise: 'USD' | 'CDF';
}

const chartConfigs = {
  usd: {
    label: 'USD',
    color: '#1e9df1',
    emoji: '💵',
  },
  cdf: {
    label: 'CDF',
    color: '#00b87a',
    emoji: '💰',
  },
};

export function BonAPayerBarChart({ data, devise }: BarChartProps) {
  const chartConfig = chartConfigs[devise.toLowerCase() as 'usd' | 'cdf'];
  
  const filteredData = data.filter(item => {
    const itemDevise = (item.devise || '').toUpperCase().trim();
    const targetDevise = devise.toUpperCase().trim();
    return itemDevise === targetDevise && item.createdAt;
  });

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

  const monthlyData = filteredData.reduce((acc, item) => {
    if (!item.createdAt) return acc;

    const date = parseDate(item.createdAt);
    
    if (!date || !isValid(date)) return acc;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
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
    
    const monthLabel = moisAbrev[month];

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthLabel,
        monthKey: monthKey,
        montant: 0,
      };
    }

    const montant = Number(item.montant) || 0;
    acc[monthKey].montant += montant;

    return acc;
  }, {} as Record<string, { month: string; monthKey: string; montant: number }>);

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

  const dataMap = new Map(dataExistantes.map(item => [item.monthKey, item]));

  const anneeReference = annees.length > 0 ? parseInt(annees[annees.length - 1]) : new Date().getFullYear();
  
  let chartData = [];
  
  for (let mois = 1; mois <= 12; mois++) {
    const monthKey = `${anneeReference}-${String(mois).padStart(2, '0')}`;
    const monthLabel = moisAbrev[mois];
    
    const dataExistant = dataMap.get(monthKey);
    
    chartData.push({
      month: monthLabel,
      monthKey: monthKey,
      montant: dataExistant ? dataExistant.montant : 0,
    });
  }

  const chartConfigForContainer = {
    montant: {
      label: devise,
      color: chartConfig.color,
    },
  };

  return (
    <Card className='h-full border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
      <CardHeader className='px-4 pt-4 pb-1.5'>
        <CardTitle className='text-sm font-medium text-primary'>
          {chartConfig.emoji} Évolution mensuelle {devise} {titreAnnee && `(${titreAnnee})`}
        </CardTitle>
        <CardDescription className='text-xs text-muted-foreground'>
          Évolution par mois
        </CardDescription>
      </CardHeader>
      <CardContent className='px-4 pb-4 pt-1'>
        <ChartContainer config={chartConfigForContainer} className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 12 }}
                stroke='hsl(var(--muted-foreground))'
              />
              <YAxis
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
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  
                  if (label === 'Aucune donnée') {
                    return (
                      <div className='rounded-lg border bg-background p-2 shadow-md'>
                        <div className='text-sm text-muted-foreground'>
                          Aucune donnée disponible pour {devise}
                        </div>
                      </div>
                    );
                  }
                  
                  const entry = payload[0] as any;
                  const value = typeof entry.value === 'number' ? entry.value : 0;
                  
                  const formattedValue = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: devise,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value);
                  
                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-md'>
                      <div className='font-medium mb-1'>{label}</div>
                      <div className='flex items-center gap-2 text-sm'>
                        <div
                          className='h-3 w-3 rounded-full'
                          style={{ backgroundColor: chartConfig.color }}
                        />
                        <span className='text-muted-foreground'>Total {devise}:</span>
                        <span className='font-medium'>{formattedValue}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey='montant'
                fill={chartConfig.color}
                radius={[4, 4, 0, 0]}
                name='montant'
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

