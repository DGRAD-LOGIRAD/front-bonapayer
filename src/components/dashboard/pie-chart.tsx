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
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { DashboardStats } from './indicateurs';

const COLORS = [
  '#00b87a', // Vert pour fractionnés
  '#f7b928', // Jaune pour non fractionnés
];

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

interface PieChartProps {
  stats: DashboardStats;
}

export function BonAPayerPieChart({ stats }: PieChartProps) {
  const totalBons = stats.bonAPayerNonFractionne + stats.bonAPayeFractionne;
  
  const data = [
    {
      name: 'Fractionnés',
      value: stats.bonAPayeFractionne,
      color: COLORS[0],
    },
    {
      name: 'Non fractionnés',
      value: stats.bonAPayerNonFractionne,
      color: COLORS[1],
    },
  ];

  return (
    <Card className='h-full border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
      <CardHeader className='px-4 pt-4 pb-1.5'>
        <CardTitle className='text-sm font-medium text-primary'>
          🥧 Répartition des bons à payer
        </CardTitle>
        <CardDescription className='text-xs text-muted-foreground'>
          Total: {totalBons} bons
        </CardDescription>
      </CardHeader>
      <CardContent className='px-4 pb-4 pt-1'>
        <ChartContainer config={chartConfig} className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign='bottom'
                height={36}
                formatter={(value) => (
                  <span className='text-xs text-muted-foreground'>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

