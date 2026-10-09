import { useWorkspaceStore, useActiveWorkspaceModules, ACCENT_COLORS } from '../store/workspaceGridStore';

export default function ModuleSettingsModal() {
  const settingsModuleId = useWorkspaceStore((state) => state.settingsModuleId);
  const closeModuleSettings = useWorkspaceStore((state) => state.closeModuleSettings);
  const removeModule = useWorkspaceStore((state) => state.removeModule);
  const renameModule = useWorkspaceStore((state) => state.renameModule);
  const toggleModuleLock = useWorkspaceStore((state) => state.toggleModuleLock);
  const duplicateModule = useWorkspaceStore((state) => state.duplicateModule);
  const updateModuleColor = useWorkspaceStore((state) => state.updateModuleColor);
  const modules = useActiveWorkspaceModules();
  const module = modules.find((m) => m.id === settingsModuleId);
  const isOpen = Boolean(module);

  return (
    <>
      <div
        onClick={closeModuleSettings}
        className={`fixed inset-0 z-10 bg-gray-500/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-20 w-100 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-border-subtle bg-white shadow-md transition-all duration-200 flex flex-col ${
          isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h1 className="text-[18px] capitalize">{module?.type ?? 'Module'} Settings</h1>
          <button
            className="p-[6px] rounded border border-border-subtle hover:bg-hover-gray cursor-pointer"
            onClick={closeModuleSettings}
          >
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Name</label>
            <input
              key={module?.id}
              type="text"
              defaultValue={module?.name ?? ''}
              onBlur={(e) => module && renameModule(module.id, e.target.value)}
              placeholder={module?.type.toUpperCase()}
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none placeholder:tracking-wide placeholder:text-text-gray"
            />
          </div>
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    module && updateModuleColor(module.id, module.color === color ? undefined : color)
                  }
                  style={{ backgroundColor: color }}
                  className={`h-6 w-6 cursor-pointer rounded-full ${
                    module?.color === color ? 'ring-2 ring-offset-2 ring-light-black' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm mt-4">
            <input
              type="checkbox"
              checked={module?.locked ?? false}
              onChange={() => module && toggleModuleLock(module.id)}
            />
            Lock position & size
          </label>
          <button
            type="button"
            onClick={() => module && duplicateModule(module.id)}
            className="cursor-pointer self-start rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray"
          >
            Duplicate Module
          </button>
        </div>
        <div className="flex justify-start border-t border-border-subtle p-4">
          <button
            type="button"
            onClick={() => module && removeModule(module.id)}
            className="flex items-center gap-2 rounded-md bg-danger px-[14px] py-[9px] text-sm font-medium text-white hover:bg-danger/80 cursor-pointer"
          >
            Remove Module
          </button>
        </div>
      </div>
    </>
  );
}
