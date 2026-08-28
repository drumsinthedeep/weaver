import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceGrid from './components/WorkspaceGrid';
import AddModuleModal from './components/AddModuleModal';

function App() {
  return (
    <div className="flex h-full w-full flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <WorkspaceGrid />
        <AddModuleModal />
      </div>
    </div>
  );
}

export default App;
  