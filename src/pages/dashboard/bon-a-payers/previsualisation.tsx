import { useParams } from 'react-router-dom';
import { useState, Component, type ReactNode, useEffect } from 'react';
import { useBonAPayer } from '@/hooks/useBonAPayer';
import { Loading } from '@/components/ui/loading';
import { ErrorDebug } from '@/components/ui/error-debug';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';

interface BonAPayerData {
  id: number;
  nomContribuable: string;
  fkContribuable: string;
  libelleProvince: string;
  libelleVille: string;
  libelleActe: string;
  motifPenalite: string;
  montant: number;
  fkDevise: string;
  dateCreate: string;
  dateEcheance: string;
  libelleCompte: string;
  fkCompte: string;
  typeBonPayer?: number;
  refernceBonMere?: string;
  nomUtilisateur: string;
  refernceBnp?: string;
  numero?: string;
}

const formatCurrency = (amount: number, currency: string) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'code',

    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
    .format(amount)
    .replace(/,/g, ' ')
    .replace('.', ',');
  return formattedAmount;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class PDFErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Error boundary - errors are handled by getDerivedStateFromError
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='flex items-center justify-center h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg'>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                Erreur de rendu PDF
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Impossible d'afficher le PDF. Veuillez réessayer.
              </p>
              <Button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                variant='outline'
                size='sm'
              >
                Réessayer
              </Button>
              {this.state.error && (
                <details className='mt-4 text-xs text-gray-400'>
                  <summary>Détails de l'erreur</summary>
                  <pre className='mt-2 p-2 bg-gray-200 rounded text-left'>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  logoContainer: {
    width: 150,
    alignItems: 'flex-start',
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerText: {
    flex: 1,
    paddingLeft: 15,
    marginBottom: 10,
  },
  republic: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    textDecoration: 'underline',
  },
  table: {
    width: '100%',
    border: '1 solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    minHeight: 20,
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    borderRight: '1 solid #000',
  },
  labelCell: {
    width: '40%',
    backgroundColor: '#F5F5F5',
    fontWeight: 'bold',
  },
  valueCell: {
    width: '60%',
  },
  signature: {
    position: 'absolute',
    bottom: 150,
    right: 50,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

const PDFViewerSkeleton = () => (
  <div className='h-full w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden'>
    {/* Header skeleton */}
    <div className='bg-white border-b border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-8 w-24' />
      </div>
      <Skeleton className='h-4 w-32 mb-2' />
      <Skeleton className='h-3 w-64' />
    </div>

    {/* PDF content skeleton */}
    <div className='p-6 space-y-4'>
      {/* Document header */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-8 w-64 mx-auto' />
      </div>

      {/* Information sections */}
      <div className='space-y-4'>
        {/* Section 1 */}
        <div className='border border-gray-200 rounded'>
          <div className='bg-gray-50 p-2 border-b border-gray-200'>
            <Skeleton className='h-4 w-48' />
          </div>
          <div className='p-3 space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex'>
                <Skeleton className='h-3 w-32 mr-4' />
                <Skeleton className='h-3 w-48' />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className='border border-gray-200 rounded'>
          <div className='bg-gray-50 p-2 border-b border-gray-200'>
            <Skeleton className='h-4 w-56' />
          </div>
          <div className='p-3 space-y-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='flex'>
                <Skeleton className='h-3 w-40 mr-4' />
                <Skeleton className='h-3 w-52' />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signature area */}
      <div className='flex justify-end mt-8'>
        <Skeleton className='h-4 w-20' />
      </div>
    </div>

    {/* Loading indicator */}
    <div className='absolute inset-0 bg-white/80 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
        <Skeleton className='h-4 w-32 mx-auto' />
      </div>
    </div>
  </div>
);

const BonAPayerOfficielPDF = ({ data }: { data: BonAPayerData }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.republic}>REPUBLIQUE DEMOCRATIQUE DU CONGO</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src='/logo-dgrad.png' />
        </View>
      </View>

      <Text style={styles.title}>
        BON A PAYER N° {data.refernceBonMere}/
        {data.typeBonPayer === 1 ? 'A' : 'B'}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMATIONS DE L'ASSUJETTI</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Nom ou raison sociale:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.nomContribuable}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Numéro impôt:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.fkContribuable}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>Adresse:</Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.libelleProvince}, {data.libelleVille}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>Téléphone:</Text>
            <Text style={[styles.tableCell, styles.valueCell]}>-</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Adresse mail:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>-</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          INFORMATIONS DE L'ORDONNANCEMENT
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Article budgétaire:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.libelleActe}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Arrêté n° ou texte réglementaire:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.libelleActe}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>Motif:</Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.motifPenalite}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Montant ordonnancé en chiffre :
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {formatCurrency(data.montant, data.fkDevise)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Date d'ordonnancement:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.dateCreate}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Date d'exigibilité:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.dateEcheance}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>Banque:</Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.libelleCompte}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Compte bancaire:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.fkCompte}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>Type:</Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.typeBonPayer === 1 ? 'Bon à payer A' : 'Bon à payer B'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Numéro Bon à payer LOGIRAD:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.refernceBonMere || '-'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Nom de l'ordonnateur:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {data.nomUtilisateur}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.signature}>Signature</Text>
    </Page>
  </Document>
);

export default function PrevisualisationPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const bonAPayerId = documentId ? parseInt(documentId, 10) : 0;
  const [activeTab, setActiveTab] = useState<string>('fraction-0');
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true);

  const { data, isLoading, isError, error } = useBonAPayer(bonAPayerId);

  // Réinitialiser l'état de chargement du PDF quand on change d'onglet
  useEffect(() => {
    setIsPdfLoading(true);
    // Simuler un délai de chargement pour le PDF
    const timer = setTimeout(() => {
      setIsPdfLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <ErrorDebug error={error as Error} />
      </div>
    );
  }

  const fractions = data.detailsBonPayerList || [];
  const currentData =
    fractions.find((_, index) => activeTab === `fraction-${index}`) ||
    fractions[0] ||
    data;

  return (
    <div className='min-h-screen bg-white'>
      <div className='mb-2 sm:mb-4 px-4 sm:px-0'>
        <div className='title text-center text-primary font-bold'>
          <h1 className='text-lg sm:text-xl md:text-2xl px-2'>
            Visualisation des bons à payer fractionnés
          </h1>
        </div>
      </div>

      <div className='bg-gray-100 border-b border-gray-200 px-2 sm:px-6 py-2 sm:py-3'>
        <div className='flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start'>
          {fractions.map((fraction: BonAPayerData, index: number) => (
            <Button
              key={fraction.id}
              variant={activeTab === `fraction-${index}` ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab(`fraction-${index}`)}
              className={`
                text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2
                ${
                  activeTab === `fraction-${index}`
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }
                whitespace-nowrap
              `}
            >
              Type {fraction.typeBonPayer === 1 ? 'A' : 'B'} :
              {fraction.typeBonPayer === 1 ? '2/3' : '1/3'}
            </Button>
          ))}
        </div>
      </div>

      <div className='h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] relative'>
        {isPdfLoading && (
          <div className='absolute inset-0 z-10'>
            <PDFViewerSkeleton />
          </div>
        )}
        <PDFErrorBoundary>
          <PDFViewer width='100%' height='100%' className='w-full h-full'>
            <BonAPayerOfficielPDF data={currentData} />
          </PDFViewer>
        </PDFErrorBoundary>
      </div>
    </div>
  );
}
