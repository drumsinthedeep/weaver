import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function ModuleSettingsModal() {
  const settingsModuleId = useWorkspaceStore((state) => state.settingsModuleId);
  const closeModuleSettings = useWorkspaceStore((state) => state.closeModuleSettings);
  const removeModule = useWorkspaceStore((state) => state.removeModule);
  const modules = useWorkspaceStore((state) => state.modules);

  const module = modules.find((m) => m.id === settingsModuleId);
  const isOpen = Boolean(module);

  return (
    <>
      <div
        onClick={closeModuleSettings}
        className={`fixed inset-0 z-10 bg-light-black/60 transition-opacity duration-300 ${
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
        <div className="p-4 text-sm text-text-gray">Settings for this module will go here.</div>
        <div className="flex justify-end border-t border-border-subtle p-4">
          <button
            type="button"
            onClick={() => module && removeModule(module.id)}
            className="flex items-center gap-2 rounded-md bg-primary-purple px-[14px] py-[9px] text-sm font-medium text-white hover:bg-primary-purple/90 cursor-pointer"
          >
            Remove Module
          </button>
        </div>
      </div>
    </>
  );
}
