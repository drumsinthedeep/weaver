import { useEffect, useState } from 'react';
import {
  useWorkspaceStore,
  Workspace,
  BackgroundTint,
  ModuleStyle,
  BACKGROUND_TINT_COLORS,
  ACCENT_COLORS,
} from '../store/workspaceGridStore';

const BACKGROUND_TINTS: { value: BackgroundTint; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'pure', label: 'Pure' },
];

const MODULE_STYLES: { value: ModuleStyle; label: string }[] = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'sharp', label: 'Sharp' },
];

interface WorkspaceDraft {
  name: string;
  description: string;
  accentColor: string;
  backgroundTint: BackgroundTint;
  moduleStyle: ModuleStyle;
}

function toDraft(workspace: Workspace | undefined): WorkspaceDraft {
  return {
    name: workspace?.name ?? '',
    description: workspace?.description ?? '',
    accentColor: workspace?.accentColor ?? ACCENT_COLORS[0],
    backgroundTint: workspace?.backgroundTint ?? 'default',
    moduleStyle: workspace?.moduleStyle ?? 'rounded',
  };
}

export default function WorkspaceSettingsModal() {
  const isOpen = useWorkspaceStore((state) => state.isWorkspaceSettingsOpen);
  const closeWorkspaceSettings = useWorkspaceStore((state) => state.closeWorkspaceSettings);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);
  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const canDelete = workspaces.length > 1;
  const [activeTab, setActiveTab] = useState<'general' | 'appearance'>('general');
  const [draft, setDraft] = useState<WorkspaceDraft>(() => toDraft(workspace));

  useEffect(() => {
    if (isOpen) {
      setDraft(toDraft(workspace));
      setActiveTab('general');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = () => {
    if (workspace) updateWorkspace(workspace.id, draft);
    closeWorkspaceSettings();
  };

  const handleDelete = () => {
    if (!workspace) return;
    removeWorkspace(workspace.id);
    closeWorkspaceSettings();
  };

  const navButtonClass = (tab: 'general' | 'appearance') =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm cursor-pointer ${
      activeTab === tab ? 'font-semibold' : 'hover:bg-hover-gray'
    }`;

  const navButtonStyle = (tab: 'general' | 'appearance') =>
    activeTab === tab
      ? { backgroundColor: `${draft.accentColor}1a`, color: draft.accentColor }
      : undefined;

  return (
    <>
      <div
        onClick={closeWorkspaceSettings}
        className={`fixed inset-0 z-10 bg-gray-500/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-20 flex w-[700px] min-h-[553px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-md transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="flex w-44 shrink-0 flex-col gap-1 border-r border-border-subtle bg-secondary-gray p-3">
          <span className="mb-1 px-3 text-xs font-semibold uppercase text-text-gray">Workspace</span>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            style={navButtonStyle('general')}
            className={navButtonClass('general')}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            style={navButtonStyle('appearance')}
            className={navButtonClass('appearance')}
          >
            Appearance
          </button>
          <p className="text-xs text-text-gray px-3 mt-auto">Changes apply to this workspace only.</p>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <div>
              <h1 className="text-[18px] font-semibold">Customize Workspace</h1>
              <p className="text-sm text-text-gray">{workspace?.name}</p>
            </div>
            <button
              type="button"
              onClick={closeWorkspaceSettings}
              className="cursor-pointer rounded border border-border-subtle p-[6px] hover:bg-hover-gray"
            >
              <img src="/icons/close.svg" alt="Close" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'general' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Workspace Name</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="mt-4 border-t border-border-subtle pt-4">
                  <button
                    type="button"
                    disabled={!canDelete}
                    onClick={handleDelete}
                    title={!canDelete ? "You can't delete your only workspace" : undefined}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-danger px-[14px] py-[9px] text-sm font-medium text-white hover:bg-danger/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete Workspace
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Accent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setDraft({ ...draft, accentColor: color })}
                        style={{ backgroundColor: color }}
                        className={`h-8 w-8 cursor-pointer rounded-full ${
                          draft.accentColor === color ? 'ring-2 ring-offset-2 ring-light-black' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Background Tint</label>
                  <div className="grid grid-cols-4 gap-2">
                    {BACKGROUND_TINTS.map((tint) => (
                      <button
                        key={tint.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, backgroundTint: tint.value })}
                        style={draft.backgroundTint === tint.value ? { borderColor: draft.accentColor } : undefined}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-sm ${
                          draft.backgroundTint === tint.value ? '' : 'border-gray-200 hover:bg-hover-gray'
                        }`}
                      >
                        <span
                          className="h-5 w-5 rounded border border-border-subtle"
                          style={{ backgroundColor: BACKGROUND_TINT_COLORS[tint.value] }}
                        />
                        {tint.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Module Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MODULE_STYLES.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, moduleStyle: style.value })}
                        style={
                          draft.moduleStyle === style.value
                            ? { borderColor: draft.accentColor, color: draft.accentColor }
                            : undefined
                        }
                        className={`cursor-pointer border p-3 text-sm font-medium ${
                          style.value === 'sharp' ? '' : 'rounded-lg'
                        } ${draft.moduleStyle === style.value ? '' : 'border-gray-200 hover:bg-hover-gray'}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border-subtle p-4">
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={closeWorkspaceSettings}
                className="cursor-pointer rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{ backgroundColor: draft.accentColor }}
                className="cursor-pointer border-1 rounded-md px-[14px] py-[9px] text-sm font-medium text-white hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
