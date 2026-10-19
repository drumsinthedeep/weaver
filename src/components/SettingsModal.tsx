import { useEffect, useState } from 'react';
import { useWorkspaceStore, SettingsTab, Profile, ACCENT_COLORS } from '../store/workspaceGridStore';
import Avatar from './Avatar';

const NAV_ITEMS: { value: SettingsTab; label: string; }[] = [
  { value: 'account', label: 'Account' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'shortcuts', label: 'Shortcuts' },
];

interface ProfileDraft {
  name: string;
  email: string;
  accentColor: string;
  avatarUrl?: string;
}

function toDraft(profile: Profile): ProfileDraft {
  return {
    name: profile.name,
    email: profile.email,
    accentColor: profile.accentColor ?? ACCENT_COLORS[0],
    avatarUrl: profile.avatarUrl,
  };
}

export default function SettingsModal() {
  const isOpen = useWorkspaceStore((state) => state.isSettingsOpen);
  const settingsTab = useWorkspaceStore((state) => state.settingsTab);
  const closeSettings = useWorkspaceStore((state) => state.closeSettings);
  const profile = useWorkspaceStore((state) => state.profile);
  const updateProfile = useWorkspaceStore((state) => state.updateProfile);
  const [activeTab, setActiveTab] = useState<SettingsTab>(settingsTab);
  const [draft, setDraft] = useState<ProfileDraft>(() => toDraft(profile));

  useEffect(() => {
    if (isOpen) {
      setActiveTab(settingsTab);
      setDraft(toDraft(profile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = () => {
    updateProfile(draft);
    closeSettings();
  };

  const handleUploadPhoto = async () => {
    const dataUrl: string | null = await window.ipcRenderer.invoke('select-image');
    if (dataUrl) setDraft({ ...draft, avatarUrl: dataUrl });
  };

  const activeLabel = NAV_ITEMS.find((item) => item.value === activeTab)?.label ?? '';

  return (
    <>
      <div
        onClick={closeSettings}
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
          <span className="mb-1 px-3 text-xs font-semibold uppercase text-text-gray">Settings</span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setActiveTab(item.value)}
              style={activeTab === item.value ? { backgroundColor: `${draft.accentColor}1a`, color: draft.accentColor } : undefined}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm cursor-pointer ${
                activeTab === item.value ? 'font-semibold' : 'hover:bg-hover-gray'
              }`}
            >
              {item.label}
            </button>
          ))}
          <p className="mt-auto px-3 text-xs text-text-gray">Weaver v1.0.0</p>
          <p className="px-3 text-xs text-text-gray">© 2026 Sigil Code</p>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <h1 className="text-[18px] font-semibold">{activeLabel}</h1>
            <button
              type="button"
              onClick={closeSettings}
              className="cursor-pointer rounded border border-border-subtle p-[6px] hover:bg-hover-gray"
            >
              <img src="/icons/close.svg" alt="Close" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'account' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={draft.name} avatarUrl={draft.avatarUrl} accentColor={draft.accentColor} size={56} />
                  <div>
                    <p className="font-semibold">{draft.name || 'Unnamed'}</p>
                    <p className="text-sm text-text-gray">{draft.email || 'No email set'}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <button
                        type="button"
                        onClick={handleUploadPhoto}
                        style={{ color: draft.accentColor }}
                        className="cursor-pointer font-medium hover:opacity-80"
                      >
                        Upload Photo
                      </button>
                      {draft.avatarUrl && (
                        <>
                          <span className="text-text-gray">&middot;</span>
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, avatarUrl: undefined })}
                            className="cursor-pointer font-medium text-text-gray hover:text-light-black"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-border-subtle pt-3 flex">
                  <div className="flex flex-col mr-auto">
                    <label className="mb-1 block text-sm font-medium">Display Name</label>
                    <p className="text-xs text-text-gray text-nowrap">Shown across all your workspaces</p>
                  </div>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-50 h-10 rounded border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="border-t border-border-subtle pt-3 flex">
                  <div className="flex flex-col mr-auto">
                    <label className="mb-1 block text-sm font-medium">Email Address</label>
                    <p className="text-xs text-text-gray text-nowrap">Used for login and notifications</p>
                  </div>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="w-50 h-10 rounded border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Accent Color</label>
                  <p className="mb-2 text-xs text-text-gray">Used on your Home page and sidebar.</p>
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
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border-subtle p-4">
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={closeSettings}
                className="cursor-pointer rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{ backgroundColor: draft.accentColor }}
                className="cursor-pointer border rounded-md px-[14px] py-[9px] text-sm font-medium text-white hover:opacity-90"
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
