import { useState, useEffect } from 'react';

interface Agent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

interface AgentListModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (agent: Agent) => void;
}

export default function AgentListModal({
  visible,
  onClose,
  onSelect,
}: AgentListModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (visible) {
      // Simule une API
      setAgents([
        {
          id: 1001,
          nom: 'Kabila',
          prenom: 'Jean',
          email: 'jean.kabila@mail.com',
        },
        {
          id: 1002,
          nom: 'Lumumba',
          prenom: 'Patrice',
          email: 'patrice.lumumba@mail.com',
        },
        {
          id: 1009,
          nom: 'Mombaya',
          prenom: 'Seth',
          email: 'smombaya@gmail.com',
        },
      ]);
    }
  }, [visible]);

  if (!visible) return null;

  const filtered = agents.filter(a =>
    `${a.nom} ${a.prenom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]'>
      <div className='bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6'>
        <h2 className='text-xl font-bold text-primary-foreground mb-4 text-center'>
          Liste des Agents
        </h2>

        <input
          type='text'
          placeholder='Rechercher un agent...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full border border-gray-300 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500'
        />

        <div className='max-h-60 overflow-y-auto'>
          <table className='w-full text-left border border-gray-200'>
            <thead className='bg-black text-gray-700'>
              <tr>
                <th className='p-2 border'>ID</th>
                <th className='p-2 border'>Nom</th>
                <th className='p-2 border'>Prénom</th>
                <th className='p-2 border'>Email</th>
                <th className='p-2 border'>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(agent => (
                <tr key={agent.id} className='hover:bg-gray-100'>
                  <td className='p-2 border'>{agent.id}</td>
                  <td className='p-2 border'>{agent.nom}</td>
                  <td className='p-2 border'>{agent.prenom}</td>
                  <td className='p-2 border'>{agent.email}</td>
                  <td className='p-2 border text-center'>
                    <button
                      onClick={() => onSelect(agent)}
                      className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm'
                    >
                      Choisir
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='text-center p-4 text-gray-500 italic'
                  >
                    Aucun agent trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='text-right mt-4'>
          <button
            onClick={onClose}
            className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
