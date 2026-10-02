import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Sidebar() {
  const profile = useWorkspaceStore((state) => state.profile);
  const openSettings = useWorkspaceStore((state) => state.openSettings);
  const activeView = useWorkspaceStore((state) => state.activeView);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const toggleSidebarCollapsed = useWorkspaceStore((state) => state.toggleSidebarCollapsed);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accentColor = profile.accentColor ?? '#6366F1';
  const collapsed = profile.sidebarCollapsed ?? false;
  const handleNavigate = (tab: 'account' | 'appearance') => {
    openSettings(tab);
    setIsAccountMenuOpen(false);
  };

  return (
    <div
      style={{ '--accent': accentColor, '--accent-tint': `${accentColor}1a` } as React.CSSProperties}
      className={`flex flex-col gap-2 bg-white border-r border-border-subtle p-2 ml-[-14px] sticky top-0 z-10 h-screen transition-[width] duration-200 ease-in ${
        collapsed ? 'w-[53px]' : 'w-[200px]'
      }`}
    >
      <div className={`flex items-center py-3 ml-[-2px]`}>
        <img src="/icons/weaver-logo.svg" alt="" className={`w-[40px] max-w-none inline-block shrink-0 mr-2`} />
        <h1
          className={`font-raleway text-lg font-semibold overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
            collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
          }`}
        >
          WEAVER
        </h1>
      </div>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          title={collapsed ? 'Home' : undefined}
          className={`group p-2 flex items-center leading-normal rounded ${collapsed ? 'w-fit' : ''}
            ${activeView === 'home'
              ? 'bg-[var(--accent-tint)] font-semibold text-[var(--accent)]'
              : 'text-light-black hover:bg-hover-gray'
          }`}
        >
          <span
            className={`mb-[1px] inline-block h-5 w-5 shrink-0 [mask-image:url('/icons/home.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
              collapsed ? '' : 'mr-2'
            } ${activeView === 'home' ? 'bg-[var(--accent)]' : 'bg-text-gray'}`}
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
            }`}
          >
            Home
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('workspace')}
          title={collapsed ? 'Workspaces' : undefined}
          className={`group p-2 flex items-center leading-normal rounded ${collapsed ? 'w-fit' : ''}
            ${activeView === 'workspace'
              ? 'bg-[var(--accent-tint)] font-semibold text-[var(--accent)]'
              : 'text-light-black hover:bg-hover-gray'
          }`}
        >
          <span
            className={`mb-[-1px] inline-block h-5 w-5 shrink-0 [mask-image:url('/icons/grid.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]
              ${collapsed ? '' : 'mr-2'} 
              ${activeView === 'workspace' ? 'bg-[var(--accent)]' : 'bg-text-gray'}`}
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
            }`}
          >
            Workspaces
          </span>
        </button>
        <a
          className={`group text-light-black p-2 flex items-center leading-normal hover:bg-hover-gray rounded ${collapsed ? 'w-fit' : ''}`}
          href="#"
          title={collapsed ? 'Archive' : undefined}
        >
          <span
            className={`mb-[1px] inline-block h-5 w-5 shrink-0 bg-text-gray [mask-image:url('/icons/archive.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
              collapsed ? '' : 'mr-2'
            }`}
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
            }`}
          >
            Archive
          </span>
        </a>
        <a
          className={`group text-light-black p-2 flex items-center leading-normal hover:bg-hover-gray rounded ${collapsed ? 'w-fit' : ''}`}
          href="#"
          title={collapsed ? 'Favorites' : undefined}
        >
          <span
            className={`mb-[1px] inline-block h-5 w-5 shrink-0 bg-text-gray [mask-image:url('/icons/star.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
              collapsed ? '' : 'mr-2'
            }`}
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
            }`}
          >
            Favorites
          </span>
        </a>
      </div>
      <div className="relative mt-auto border-t border-border-subtle pt-2">
        <button
          type="button"
          onClick={() => setIsAccountMenuOpen((open) => !open)}
          title={collapsed ? profile.name || 'Account' : undefined}
          className={`flex w-full flex-row p-2 text-light-black items-center leading-none hover:bg-hover-gray rounded cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <img src="/icons/user.svg" alt="" className={`w-5 h-5 shrink-0 ${collapsed ? '' : 'mr-2'}`} />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ease-in duration-200 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
            }`}
          >
            {profile.name || 'Account'}
          </span>
        </button>
        {isAccountMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsAccountMenuOpen(false)} />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-md border border-border-subtle bg-white shadow-md">
              <ul className="p-1">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('account')}
                    className="flex rounded w-full items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray"
                  >
                    Account
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('appearance')}
                    className="flex rounded w-full items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray"
                  >
                    Preferences
                  </button>
                </li>
              </ul>
              <div className="p-1 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="flex rounded w-full items-center px-3 py-2 text-left text-sm cursor-pointer text-danger hover:bg-hover-gray"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="cursor-pointer rounded-lg border border-border-subtle p-1 hover:bg-hover-gray bg-white absolute top-1/2 right-[-13px] -translate-y-1/2"
      >
        <span
          className="block h-4 w-4 bg-text-gray [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]"
          style={{ maskImage: `url(/icons/${collapsed ? 'right-caret' : 'left-caret'}.svg)` }}
        />
      </button>
    </div>
  );
}
