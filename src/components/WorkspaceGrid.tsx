import { useWorkspaceStore } from '../store/workspaceGridStore';
import Module from './Module';

function WorkspaceGrid(): React.JSX.Element {
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);

  return (
    <div>
      <div className="workspace-grid grid grid-cols-12 auto-rows-[80px] gap-4 p-4">
        {modules.map((module) => (
          <Module key={module.id} module={module} />
        ))}
      </div>
      <button type="button" onClick={() => addModule({
        id: crypto.randomUUID(),
        type: 'browser',
        x: 0,
        y: 0,
        w: 4,
        h: 4,
      })}>
        add module
      </button>
    </div>
  );
}

export default WorkspaceGrid;
