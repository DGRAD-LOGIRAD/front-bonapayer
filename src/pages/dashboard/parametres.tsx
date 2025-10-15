import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

function ParametresPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Paramètres</h2>
        <p className='text-muted-foreground'>
          Configurez les préférences générales de l’application.
        </p>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recevez des alertes sur l’activité des bons à payer.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Alertes de création</p>
                <p className='text-sm text-muted-foreground'>
                  Notifie lorsqu’un nouveau bon à payer est enregistré.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Alertes de validation</p>
                <p className='text-sm text-muted-foreground'>
                  Notifie lorsqu’un bon à payer est validé ou rejeté.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affichage</CardTitle>
            <CardDescription>
              Personnalisez l’apparence de votre interface.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <p className='font-medium'>Couleurs institutionnelles</p>
              <p className='text-sm text-muted-foreground'>
                Palette issue de la charte graphique de la DGRAD.
              </p>
            </div>
            <div className='space-y-1'>
              <p className='font-medium'>Mode sombre</p>
              <p className='text-sm text-muted-foreground'>
                Bientôt disponible pour les utilisateurs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ParametresPage;
