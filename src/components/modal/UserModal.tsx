'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';

import Loading from '../loading/Loading';
import { useModalStore } from '@/stores/useModalStore';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores';

interface Agent {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  fk_site_intitule: string;
  fk_fonction_intitule: string;
  telephone: string;
}

export default function UserModal() {
  // 🔹 Store pour gérer l'affichage
  const showModal = useModalStore(state => state.showUserModal);
  const setShowModal = useModalStore(state => state.setShowUserModal);
  const { fetchUsers } = useUserStore();

  const [login, setLogin] = useState('');
  const [mail, setMail] = useState('');
  const [fkAgent, setFkAgent] = useState<number | null>(null);
  const [agentInfo, setAgentInfo] = useState<Agent | null>(null);
  const [showAgentList, setShowAgentList] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { user } = useAuthStore();

  // 🔹 Charger les agents si modal visible et liste ouverte
  useEffect(() => {
    if (showModal && showAgentList) {
      setLoading(true);
      axios
        .get(`/api-utilisateur/v1/getListAllAgent`, {
          headers: { Authorization: 'Bearer 123' },
        })
        .then(res => setAgents(res.data.content || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [showModal, showAgentList]);

  if (!showModal) return null;

  const handleSave = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!login) newErrors.login = 'Le login est obligatoire';
    if (!mail) newErrors.mail = "L'email est obligatoire";
    if (!fkAgent) newErrors.fkAgent = 'Vous devez sélectionner un agent';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = { login, mail, fkAgent, fkUtilisateurCreat: user?.id };

    axios
      .post(`/api-utilisateur/v1/saveCompte`, data, {
        headers: { Authorization: 'Bearer 123' },
      })
      .then(() => {
        alert('✅ Utilisateur enregistré avec succès !');
        setShowModal(false);
        fetchUsers();
      })
      .catch(err => {
        if (err.response?.data?.message) {
          setErrors({ backend: err.response.data.message });
        } else {
          setErrors({ backend: 'Une erreur est survenue' });
        }
      });
  };

  // 🔹 Filtrer et paginer
  const filteredAgents = agents.filter(a =>
    a.nomComplet.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='fixed inset-0 bg-black/30 flex justify-center items-center z-[1000]'>
      <div className='bg-white w-11/12 max-w-3xl rounded-2xl shadow-xl p-6 relative z-[1001]'>
        {!showAgentList ? (
          <>
            <h2 className='text-2xl font-bold mb-4 text-center text-primary'>
              Ajouter un Utilisateur
            </h2>

            {errors.backend && (
              <p className='text-red-500 mb-2 text-center'>{errors.backend}</p>
            )}

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Login <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={login}
                onChange={e => setLogin(e.target.value)}
                className={`w-full border rounded-md p-2 focus:ring-2 ${errors.login ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder='Ex: seth.mombaya'
              />
              {errors.login && (
                <p className='text-red-500 text-sm mt-1'>{errors.login}</p>
              )}
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                value={mail}
                onChange={e => setMail(e.target.value)}
                className={`w-full border rounded-md p-2 focus:ring-2 ${errors.mail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder='Ex: smombaya@gmail.com'
              />
              {errors.mail && (
                <p className='text-red-500 text-sm mt-1'>{errors.mail}</p>
              )}
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Agent <span className='text-red-500'>*</span>
              </label>
              {agentInfo ? (
                <div className='border rounded-md p-3 bg-gray-50'>
                  <p>
                    <strong>Nom complet :</strong> {agentInfo.nomComplet}
                  </p>
                  <p>
                    <strong>Site :</strong> {agentInfo.fk_site_intitule}
                  </p>
                  <p>
                    <strong>Fonction :</strong> {agentInfo.fk_fonction_intitule}
                  </p>
                  <p>
                    <strong>Téléphone :</strong> {agentInfo.telephone}
                  </p>
                </div>
              ) : (
                <p
                  className={`italic ${errors.fkAgent ? 'text-red-500' : 'text-gray-400'}`}
                >
                  Aucun agent sélectionné
                </p>
              )}
              {errors.fkAgent && (
                <p className='text-red-500 text-sm mt-1'>{errors.fkAgent}</p>
              )}
              <Button
                onClick={() => setShowAgentList(true)}
                className='mt-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-md'
              >
                Sélectionner un agent
              </Button>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={() => setShowModal(false)}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md'
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md'
              >
                Enregistrer
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Liste des agents avec recherche et pagination */}
            <h2 className='text-xl font-bold text-primary mb-4 text-center'>
              Liste des Agents
            </h2>
            <input
              type='text'
              placeholder='Rechercher un agent...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500'
            />
            {loading ? (
              <Loading />
            ) : (
              <div className='max-h-80 overflow-y-auto'>
                <table className='w-full text-left border border-gray-200'>
                  <thead className='bg-primary text-white'>
                    <tr>
                      <th className='p-2 border'>#</th>
                      <th className='p-2 border'>Nom complet</th>
                      <th className='p-2 border'>Site</th>
                      <th className='p-2 border'>Fonction</th>
                      <th className='p-2 border'>Téléphone</th>
                      <th className='p-2 border'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAgents.map((agent, idx) => (
                      <tr key={agent.id} className='hover:bg-gray-100'>
                        <td className='p-2 border'>
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className='p-2 border'>{agent.nomComplet}</td>
                        <td className='p-2 border'>{agent.fk_site_intitule}</td>
                        <td className='p-2 border'>
                          {agent.fk_fonction_intitule}
                        </td>
                        <td className='p-2 border'>{agent.telephone || '-'}</td>
                        <td className='p-2 border text-center'>
                          <button
                            onClick={() => {
                              setAgentInfo(agent);
                              setFkAgent(agent.id);
                              setShowAgentList(false);
                            }}
                            className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm'
                          >
                            Choisir
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedAgents.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className='text-center p-4 text-gray-500 italic'
                        >
                          Aucun agent trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className='flex justify-center mt-6 gap-2 flex-wrap'>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Précédent
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-primary text-white shadow' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Suivant
              </button>
            </div>
            <div className='text-right mt-4'>
              <button
                onClick={() => setShowAgentList(false)}
                className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md'
              >
                Retour
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
