import { useParams } from 'react-router-dom';
import { useState, Component, type ReactNode, useEffect, useMemo, memo, useRef } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  pdf,
} from '@react-pdf/renderer';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { QueryStateWrapper } from '@/components/ui/query-state-wrapper';
import { PrevisualisationSkeleton } from '@/components/dashboard/previsualisation-skeleton';
import { useBonAPayer } from '@/hooks/useBonAPayer';
import type { BonPayerDetail } from '@/services/api';

type BonPayerData = BonPayerDetail & {
  refernceLogirad?: string;
  refernceBonMere?: string;
  typeBonPayer?: number;
};

const formatCurrencyForPDF = (amount: number, currency: string) => {
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount} ${currency}`;
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
          <div className='flex items-center justify-center h-[800px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg'>
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

const BonAPayerOfficielPDF = memo(({ data }: { data: BonPayerData }) => (
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
        BON A PAYER N° {data.refernceBonMere || data.refernceBnp}/
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
              {formatCurrencyForPDF(data.montant, data.fkDevise)}
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
              {data.refernceBonMere || data.refernceBnp || '-'}
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
));

BonAPayerOfficielPDF.displayName = 'BonAPayerOfficielPDF';

function PrevisualisationPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [activeTab, setActiveTab] = useState<string>('fraction-0');
  const [isPdfReady, setIsPdfReady] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  const bonAPayerId = useMemo(() => {
    if (!documentId) return 0;
    const parsed = parseInt(documentId, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [documentId]);

  const { data, isLoading, error } = useBonAPayer(bonAPayerId);

  useEffect(() => {
    if (data) {
      document.title = `Prévisualisation - Bon à payer Nº ${data.refernceLogirad} - DGRAD`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Prévisualisation du bon à payer ${data.refernceLogirad} - ${data.nomContribuable}`
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = `Prévisualisation du bon à payer ${data.refernceLogirad} - ${data.nomContribuable}`;
        document.head.appendChild(meta);
      }
    }
  }, [data]);

  const fractions = useMemo(() => {
    if (!data?.detailsBonPayerList) return [];
    return data.detailsBonPayerList as BonPayerData[];
  }, [data]);

  const currentData = useMemo(() => {
    if (fractions.length === 0) {
      return data ? ({
        ...data,
        refernceBonMere: data.refernceLogirad,
      } as BonPayerData) : null;
    }

    const tabIndex = parseInt(activeTab.replace('fraction-', ''), 10);
    const fraction = fractions[tabIndex >= 0 ? tabIndex : 0];

    if (fraction) {
      return {
        ...fraction,
        refernceBonMere: fraction.refernceBonMere || data?.refernceLogirad,
      } as BonPayerData;
    }

    return null;
  }, [fractions, activeTab, data]);

  useEffect(() => {
    setIsPdfReady(false);
    const timer = setTimeout(() => {
      setIsPdfReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, currentData]);

  const handleDownload = async () => {
    if (!currentData) return;

    try {
      const doc = <BonAPayerOfficielPDF data={currentData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bon-a-payer-${currentData.refernceBonMere || currentData.refernceBnp || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
    }
  };

  const handlePrint = async () => {
    if (!currentData) return;

    try {
      const doc = <BonAPayerOfficielPDF data={currentData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(url);
          }, 250);
        };
      } else {
        console.error('Impossible d\'ouvrir la fenêtre d\'impression');
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression du PDF:', error);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleFullscreen = () => {
    if (!pdfViewerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      pdfViewerRef.current.requestFullscreen();
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <QueryStateWrapper
        loading={isLoading}
        error={error || null}
        data={data}
        skeleton={<PrevisualisationSkeleton />}
        errorTitle='Erreur lors du chargement de la prévisualisation'
        showEmpty={true}
        emptyMessage='Bon à payer non trouvé'
      >
        {() => (
          <>
            <div className='mb-2 sm:mb-4 px-4 sm:px-0'>
              <div className='title text-center text-primary font-bold'>
                <h1 className='text-lg sm:text-xl md:text-2xl px-2'>
                  Visualisation des bons à payer fractionnés
                </h1>
              </div>
            </div>

            {fractions.length > 0 && (
              <div className='bg-gray-100 border-b border-gray-200 px-2 sm:px-6 py-2 sm:py-3'>
                <div className='flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start'>
                  {fractions.map((fraction: BonPayerData, index: number) => (
                    <Button
                      key={fraction.id || index}
                      variant={activeTab === `fraction-${index}` ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setActiveTab(`fraction-${index}`)}
                      className={`
                        text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2
                        ${activeTab === `fraction-${index}`
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
            )}

            <div className='bg-gray-100 border-b border-gray-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  title='Zoom arrière'
                >
                  <ZoomOut className='h-4 w-4' />
                </Button>
                <span className='text-sm text-muted-foreground min-w-[60px] text-center'>
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  title='Zoom avant'
                >
                  <ZoomIn className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleResetZoom}
                  title='Réinitialiser le zoom'
                >
                  <RotateCw className='h-4 w-4' />
                </Button>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownload}
                  title='Télécharger le PDF'
                >
                  <Download className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>Télécharger</span>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePrint}
                  title='Imprimer'
                >
                  <Printer className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>Imprimer</span>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleFullscreen}
                  title='Plein écran'
                >
                  <Maximize className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div ref={pdfViewerRef} className='relative h-[1100px]'>
              {!isPdfReady && (
                <div className='absolute inset-0 z-10 bg-white'>
                  <PrevisualisationSkeleton />
                </div>
              )}
              {currentData ? (
                <div
                  className={isPdfReady ? 'block h-full overflow-auto' : 'invisible h-full'}
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                >
                  <div style={{ width: `${100 / scale}%`, height: `${100 / scale}%` }}>
                    <PDFErrorBoundary>
                      <PDFViewer width='100%' height='100%' className='w-full h-full'>
                        <BonAPayerOfficielPDF data={currentData} />
                      </PDFViewer>
                    </PDFErrorBoundary>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-muted-foreground'>Aucune donnée à afficher</p>
                </div>
              )}
            </div>
          </>
        )}
      </QueryStateWrapper>
    </div>
  );
}

export default memo(PrevisualisationPage);
