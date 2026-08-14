import { useWorkspaceStore } from '../store/workspaceGridStore';

function WorkspaceGrid(): React.JSX.Element {
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);
  const removeModule = useWorkspaceStore((state) => state.removeModule);

  return (
    <div>
      {modules.map((module) => (
        <div key={module.id}>
          <h2>{module.type}</h2>
          <p>
            Position: ({module.x}, {module.y}), Size: ({module.w} x {module.h})
          </p>
          <button type="button" onClick={() => removeModule(module.id)}>
            remove module
          </button>
        </div>
      ))}
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
