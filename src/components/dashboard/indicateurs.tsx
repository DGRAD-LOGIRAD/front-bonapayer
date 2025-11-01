import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { formatCurrency } from '@/lib/utils';

export interface DashboardStats {
  bonAPayerNonFractionne: number;
  bonAPayeFractionne: number;
  totalUSD: number;
  totalCDF: number;
}

interface IndicateursProps {
  stats: DashboardStats;
}

function Indicateurs({ stats }: IndicateursProps) {
  const indicators = [
    {
      title: 'Bons à payer',
      description: 'Nombre des bons à payer',
      value: stats.bonAPayerNonFractionne + stats.bonAPayeFractionne,
      emoji: '📄',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bons à payer fractionnés',
      description: 'Nombre des bons à payer fractionnés',
      value: stats.bonAPayeFractionne,
      emoji: '✅',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total USD',
      description: 'Montant total en USD',
      value: formatCurrency(stats.totalUSD, 'USD'),
      emoji: '💵',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total CDF',
      description: 'Montant total en CDF',
      value: formatCurrency(stats.totalCDF, 'CDF'),
      emoji: '💰',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 h-full'>
      {indicators.map((indicator, index) => {
        const displayValue =
          typeof indicator.value === 'number'
            ? indicator.value.toLocaleString('fr-FR')
            : indicator.value;

        return (
          <Card
            key={index}
            className='h-full border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 pt-4'>
              <CardTitle className='text-sm font-medium text-primary'>
                {indicator.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${indicator.bgColor} text-xl`}>
                {indicator.emoji}
              </div>
            </CardHeader>
            <CardContent className='px-4 pb-4 pt-1'>
              <div className='text-lg font-bold text-balance break-words mb-0.5'>
                {displayValue}
              </div>
              <CardDescription className='text-xs text-muted-foreground'>
                {indicator.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default Indicateurs;
