import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, Clock, CheckCircle, DollarSign, Coins } from 'lucide-react';

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
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bons à payer non fractionnés',
      description: 'Nombre des bons à payer non fractionnés',
      value: stats.bonAPayerNonFractionne,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Bons à payer fractionnés',
      description: 'Nombre des bons à payer fractionnés',
      value: stats.bonAPayeFractionne,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total USD',
      description: 'Montant total en USD',
      value: formatCurrency(stats.totalUSD, 'USD'),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total CDF',
      description: 'Montant total en CDF',
      value: formatCurrency(stats.totalCDF, 'CDF'),
      icon: Coins,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5 h-full'>
      {indicators.map((indicator, index) => {
        const IconComponent = indicator.icon;
        const displayValue =
          typeof indicator.value === 'number'
            ? indicator.value.toLocaleString('fr-FR')
            : indicator.value;

        return (
          <Card
            key={index}
            className='h-full border-2 border-gray-200/50 hover:border-gray-300/70 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/80 hover:bg-white/90'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {indicator.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${indicator.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${indicator.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{displayValue}</div>
              <CardDescription className='text-xs text-muted-foreground mt-1'>
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
