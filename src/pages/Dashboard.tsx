import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TeamLeadView from '../components/TeamLeadView';
import TeamMemberView from '../components/TeamMemberView';
import { useSelector } from 'react-redux';

const DashboardContent: React.FC = () => {
  const { currentRole } = useSelector((state: RootState) => state.role);
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {currentRole === 'Team Lead' ? (
            <TeamLeadView activeSection={activeSection} />
          ) : (
            <TeamMemberView activeSection={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
};

export default Dashboard;