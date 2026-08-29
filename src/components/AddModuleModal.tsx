import { useWorkspaceStore, ModuleType } from '../store/workspaceGridStore';

const GRID_COLUMNS = 12;

interface ModuleTypeOption {
  name: string;
  icon: string;
  description: string;
  type: ModuleType | null;
}

export default function AddModuleModal() {
  const isAddModuleModalOpen = useWorkspaceStore((state) => state.isAddModuleModalOpen);
  const closeAddModuleModal = useWorkspaceStore((state) => state.closeAddModuleModal);
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);

  const taskType: ModuleTypeOption = { name: 'Task', icon: '/icons/tasks.svg', description: 'Checklist with progress tracking and due dates.', type: 'tasks' };
  const noteType: ModuleTypeOption = { name: 'Note', icon: '/icons/notes.svg', description: 'Freeform notes, research logs, and markdown.', type: 'notes' };
  const browserType: ModuleTypeOption = { name: 'Browser', icon: '/icons/browser.svg', description: 'Browse websites natively inside your workspace.', type: 'browser' };
  const bookmarkType: ModuleTypeOption = { name: 'Bookmark', icon: '/icons/bookmark.svg', description: 'Save and organize important links.', type: null };
  const fileType: ModuleTypeOption = { name: 'File', icon: '/icons/file.svg', description: 'Attach and organize documents and media.', type: null };
  const calendarType: ModuleTypeOption = { name: 'Calendar', icon: '/icons/calendar.svg', description: 'Events, reminders, and scheduling.', type: null };
  const customType: ModuleTypeOption = { name: 'Custom', icon: '/icons/custom.svg', description: 'Custom modules for specific use cases.', type: null };

  const handleSelectType = (type: ModuleType | null) => {
    if (!type) return;

    const w = 4;
    const h = 4;
    const x = (modules.length * w) % GRID_COLUMNS;
    const y = modules.reduce((bottomEdge, module) => Math.max(bottomEdge, module.y + module.h), 0);

    const id = crypto.randomUUID();

    if (type === 'browser') {
      const tabId = crypto.randomUUID();
      addModule({ id, type, x, y, w, h, tabs: [{ id: tabId, url: '' }], activeTabId: tabId });
    } else {
      addModule({ id, type, x, y, w, h });
    }

    closeAddModuleModal();
  };

  return (
    <>
      <div
        onClick={closeAddModuleModal}
        className={`fixed inset-0 z-10 bg-light-black/60 transition-opacity duration-300 ${
          isAddModuleModalOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed border-l-2 border-border-subtle top-0 right-0 z-20 h-full w-150 bg-white transition-transform duration-300 flex flex-col ${
          isAddModuleModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h1 className="text-[18px]">Add Module</h1>
          <button className="p-[6px] rounded border border-border-subtle hover:bg-hover-gray cursor-pointer" onClick={closeAddModuleModal}>
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {[browserType, noteType, taskType, bookmarkType, fileType, calendarType, customType].map((moduleOption) => (
            <div
              key={moduleOption.name}
              onClick={() => handleSelectType(moduleOption.type)}
              className={`hover:bg-hover-gray flex flex-col items-center gap-2 p-8 border border-gray-200 rounded-lg shadow-subtle transition-all duration-200 ${
                moduleOption.type
                  ? 'cursor-pointer hover:border-primary-purple hover:shadow-md'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              <img src={moduleOption.icon} alt={moduleOption.name} className="w-8 h-8" />
              <h2 className="font-semibold">{moduleOption.name}</h2>
              <p className="text-sm text-text-gray text-center">{moduleOption.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
