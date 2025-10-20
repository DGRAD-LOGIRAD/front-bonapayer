import { useState } from 'react';
import DataTableUser from '@/components/dashboard/datatableuser';
import {
  FaKey,
  FaShieldAlt,
  FaUser,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa';
import DatatableModul from '@/components/dashboard/datatablemodul';

function Utilisateurs() {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const tabs = [
    { icon: <FaUser />, label: 'Utilisateurs' },
    { icon: <FaShieldAlt />, label: 'Modul' },
    { icon: <FaUsers />, label: 'Groupes' },
    { icon: <FaKey />, label: 'Utilisateur Privilège' },
    { icon: <FaUsers />, label: 'Privilège Groupes' },
    { icon: <FaUserFriends />, label: 'Utilisateur Groupe' },
  ];

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      {/* 🔹 Barre d’onglets */}
      <div className='flex overflow-x-auto border-b border-gray-300 no-scrollbar'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200
              ${
                selectedTab === index
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
          >
            <span className='text-lg'>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 🔹 Contenu principal */}
      <div className='space-y-6 mt-4'>
        {selectedTab === 0 && <DataTableUser />}
        {selectedTab === 1 && <DatatableModul />}
      </div>
    </div>
  );
}

export default Utilisateurs;
