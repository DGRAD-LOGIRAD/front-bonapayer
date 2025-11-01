import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

function ProfilePage() {
  useEffect(() => {
    document.title = 'Mon Profil - DGRAD';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Gérer vos informations personnelles');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Gérer vos informations personnelles';
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Consultez et mettez à jour vos informations de connexion.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarFallback className='text-lg font-semibold'>
                KK
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-xl font-semibold text-foreground'>
                KASHALA KABANGU Willy
              </p>
              <p className='text-sm text-muted-foreground'>
                Administrateur DGRAD
              </p>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-1'>
              <p className='text-xs uppercase text-muted-foreground'>Email</p>
              <p className='flex items-center gap-2 font-medium'>
                <Mail className='h-4 w-4 text-primary' />
                kashala.kabangu@dgrad.gov.cd
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase text-muted-foreground'>
                Téléphone
              </p>
              <p className='flex items-center gap-2 font-medium'>
                <Phone className='h-4 w-4 text-primary' />
                +243 820 000 000
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase text-muted-foreground'>
                Matricule
              </p>
              <p className='font-medium'>DGRAD-2024-001</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs uppercase text-muted-foreground'>Rôle</p>
              <p className='font-medium'>Administrateur</p>
            </div>
          </div>

          <Button className='w-fit'>Mettre à jour le profil</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dernière connexion</CardTitle>
          <CardDescription>
            Historique de vos connexions récentes au système.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div>
            <p className='text-sm font-semibold'>15/10/2025 - 14:19</p>
            <p className='text-sm text-muted-foreground'>
              Depuis le site DIRDOM (Kinshasa)
            </p>
          </div>
          <div>
            <p className='text-sm font-semibold'>12/10/2025 - 09:45</p>
            <p className='text-sm text-muted-foreground'>
              Depuis le site DIRDOM (Kinshasa)
            </p>
          </div>
          <div>
            <p className='text-sm font-semibold'>10/10/2025 - 16:02</p>
            <p className='text-sm text-muted-foreground'>
              Depuis le site DIRDOM (Kinshasa)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
