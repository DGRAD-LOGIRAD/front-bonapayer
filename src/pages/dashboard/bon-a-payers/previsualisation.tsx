import { useParams } from 'react-router-dom';
import { useState, Component, type ErrorInfo, type ReactNode } from 'react';
import { useBonAPayer } from '@/hooks/useBonAPayer';
import { Loading } from '@/components/ui/loading';
import { ErrorDebug } from '@/components/ui/error-debug';
import { Button } from '@/components/ui/button';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';

// Interface pour les données du bon à payer
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

// ErrorBoundary pour capturer les erreurs PDF
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PDF Error Boundary caught an error:', error, errorInfo);
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
    width: 150,
    height: 60,
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

// Composant PDF officiel pour un bon à payer
const BonAPayerOfficielPDF = ({ data }: { data: BonAPayerData }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.republic}>REPUBLIQUE DEMOCRATIQUE DU CONGO</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src='/dgrad-logo.png' />
        </View>
      </View>

      {/* Titre principal */}
      <Text style={styles.title}>
        BON A PAYER N° {data.refernceBnp || data.numero}
      </Text>

      {/* Section 1: Informations de l'assujetti */}
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

      {/* Section 2: Informations de l'ordonnancement */}
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
              Montant ordonnancé en chiffre / lettre:
            </Text>
            <Text style={[styles.tableCell, styles.valueCell]}>
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: data.fkDevise,
              }).format(data.montant)}
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
              {data.typeBonPayer || '-'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.labelCell]}>
              Référence Bon à payer Parent:
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

      {/* Signature */}
      <Text style={styles.signature}>Signature</Text>
    </Page>
  </Document>
);

export default function PrevisualisationPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const bonAPayerId = documentId ? parseInt(documentId, 10) : 0;
  const [activeTab, setActiveTab] = useState<string>('fraction-0');

  const { data, isLoading, isError, error } = useBonAPayer(bonAPayerId);

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

  // Préparer les données pour les fractions
  const fractions = data.detailsBonPayerList || [];
  const currentData =
    fractions.find((_, index) => activeTab === `fraction-${index}`) ||
    fractions[0] ||
    data;

  return (
    <div className='min-h-screen bg-white'>
      <div className='mb-4'>
        <div className='title text-center text-primary font-bold'>
          <h1 className='text-2xl'>
            Visualisation des bons à payer fractionnés
          </h1>
        </div>
      </div>
      <div className='bg-gray-100 border-b border-gray-200 px-6 py-3'>
        <div className='flex space-x-4'>
          {fractions.map((fraction: BonAPayerData, index: number) => (
            <Button
              key={fraction.id}
              variant={activeTab === `fraction-${index}` ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab(`fraction-${index}`)}
              className={
                activeTab === `fraction-${index}`
                  ? 'bg-primary text-white'
                  : 'text-gray-600'
              }
            >
              Bon à payer type {fraction.typeBonPayer || 0} (
              {fraction.typeBonPayer === 1 ? '1/3' : '2/3'})
            </Button>
          ))}
        </div>
      </div>

      <div className='h-[calc(100vh-60px)]'>
        <PDFErrorBoundary>
          <PDFViewer width='100%' height='100%'>
            <BonAPayerOfficielPDF data={currentData} />
          </PDFViewer>
        </PDFErrorBoundary>
      </div>
    </div>
  );
}
