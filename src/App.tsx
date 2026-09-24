import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceGrid from './components/WorkspaceGrid';
import AddModuleModal from './components/AddModuleModal';
import ModuleSettingsModal from './components/ModuleSettingsModal';
import WorkspaceSettingsModal from './components/WorkspaceSettingsModal';
import SettingsModal from './components/SettingsModal';

function App() {
  return (
    <div className="flex h-full w-full flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <WorkspaceGrid />
        <AddModuleModal />
        <ModuleSettingsModal />
        <WorkspaceSettingsModal />
        <SettingsModal />
      </div>
    </div>
  );
}

export default App;
  