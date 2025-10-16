import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorDebugProps {
  error: Error;
  title?: string;
}

export function ErrorDebug({ error, title = 'Erreur API' }: ErrorDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getErrorType = (error: Error) => {
    if (error.message.includes('Erreur serveur')) return 'server';
    if (error.message.includes('Aucune réponse du serveur')) return 'network';
    if (error.message.includes('Erreur de configuration')) return 'config';
    return 'unknown';
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case 'server':
        return 'destructive';
      case 'network':
        return 'secondary';
      case 'config':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const errorType = getErrorType(error);

  return (
    <Card className='border-destructive'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-destructive' />
            <CardTitle className='text-destructive text-lg'>{title}</CardTitle>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant={getErrorColor(errorType)}>
              {errorType === 'server' && 'Serveur'}
              {errorType === 'network' && 'Réseau'}
              {errorType === 'config' && 'Configuration'}
              {errorType === 'unknown' && 'Inconnu'}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-sm text-muted-foreground mb-3'>{error.message}</p>

        {isExpanded && (
          <div className='space-y-3'>
            <div>
              <h4 className='font-semibold text-sm mb-2'>Détails techniques</h4>
              <pre className='bg-muted p-3 rounded-md text-xs overflow-auto max-h-40'>
                {error.stack || 'Stack trace non disponible'}
              </pre>
            </div>

            <div>
              <h4 className='font-semibold text-sm mb-2'>Suggestions</h4>
              <ul className='text-sm text-muted-foreground space-y-1'>
                {errorType === 'server' && (
                  <>
                    <li>• Vérifiez que le serveur backend est accessible</li>
                    <li>• Vérifiez les logs du serveur pour plus de détails</li>
                    <li>
                      • Assurez-vous que l'endpoint existe et accepte les
                      requêtes POST
                    </li>
                  </>
                )}
                {errorType === 'network' && (
                  <>
                    <li>• Vérifiez votre connexion internet</li>
                    <li>• Vérifiez que le serveur backend est en ligne</li>
                    <li>• Vérifiez la configuration du proxy Vite</li>
                  </>
                )}
                {errorType === 'config' && (
                  <>
                    <li>• Vérifiez la configuration d'Axios</li>
                    <li>• Vérifiez les headers de la requête</li>
                    <li>• Vérifiez le format des données envoyées</li>
                  </>
                )}
                {errorType === 'unknown' && (
                  <>
                    <li>• Consultez la console pour plus de détails</li>
                    <li>• Vérifiez les logs du navigateur</li>
                    <li>• Contactez le support technique</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
