import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';

function Module({ module }: { module: WorkspaceModule }): React.JSX.Element {
  const removeModule = useWorkspaceStore((state) => state.removeModule);

  const style = {
    gridColumn: `${module.x + 1} / span ${module.w}`,
    gridRow: `${module.y + 1} / span ${module.h}`,
  };

  return (
    <div style={style} className="border border-gray-300">
      <h2>{module.type}</h2>
      <p>
        Position: ({module.x}, {module.y}), Size: ({module.w} x {module.h})
      </p>
      {module.type === 'browser' && <p>browser panel</p>}
      {module.type === 'notes' && <p>notes</p>}
      {module.type === 'tasks' && <p>tasks</p>}
      <button type="button" onClick={() => removeModule(module.id)}>
        remove module
      </button>
    </div>
  );
}

export default Module;
