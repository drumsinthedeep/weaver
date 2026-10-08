import { useRef } from 'react';
import { useWorkspaceStore, useActiveWorkspaceModules, ACCENT_COLORS } from '../store/workspaceGridStore';

export default function AddEventModal() {
  const addEventModuleId = useWorkspaceStore((state) => state.addEventModuleId);
  const closeAddEventModal = useWorkspaceStore((state) => state.closeAddEventModal);
  const addEvent = useWorkspaceStore((state) => state.addEvent);
  const modules = useActiveWorkspaceModules();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const accentColor = workspaces.find((w) => w.id === activeWorkspaceId)?.accentColor ?? '#6366F1';
  const module = modules.find((m) => m.id === addEventModuleId);
  const isOpen = Boolean(module);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const datetimeInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleAddEvent = () => {
    if (!module) return;
    const title = titleInputRef.current?.value.trim();
    const datetime = datetimeInputRef.current?.value;
    if (!title || !datetime) return;
    const location = locationInputRef.current?.value.trim() || undefined;
    const color = ACCENT_COLORS[(module.events?.length ?? 0) % ACCENT_COLORS.length];
    addEvent(module.id, { id: crypto.randomUUID(), title, datetime, location, color });
    closeAddEventModal();
  };

  return (
    <>
      <div
        onClick={closeAddEventModal}
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
          <h1 className="text-[18px]">Add Event</h1>
          <button
            className="p-[6px] rounded border border-border-subtle hover:bg-hover-gray cursor-pointer"
            onClick={closeAddEventModal}
          >
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Title</label>
            <input
              key={module?.id}
              type="text"
              ref={titleInputRef}
              placeholder="Test Drive — Toyota RAV4"
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Date &amp; Time</label>
            <input
              key={`${module?.id}-datetime`}
              type="datetime-local"
              ref={datetimeInputRef}
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-text-gray outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Location (optional)</label>
            <input
              key={`${module?.id}-location`}
              type="text"
              ref={locationInputRef}
              placeholder="Toyota of Chicago"
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border-subtle p-4">
          <button
            type="button"
            onClick={closeAddEventModal}
            className="cursor-pointer rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddEvent}
            style={{ backgroundColor: accentColor }}
            className="cursor-pointer rounded-md px-[14px] py-[9px] text-sm font-medium text-white hover:opacity-90"
          >
            Add Event
          </button>
        </div>
      </div>
    </>
  );
}
