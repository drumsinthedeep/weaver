import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Sidebar() {
  const profile = useWorkspaceStore((state) => state.profile);
  const openSettings = useWorkspaceStore((state) => state.openSettings);
  const activeView = useWorkspaceStore((state) => state.activeView);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const handleNavigate = (tab: 'account' | 'appearance') => {
    openSettings(tab);
    setIsAccountMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 bg-white border-r border-border-subtle p-2 ml-[-14px] sticky top-0 z-10 h-screen w-[200px]">
      <div className="flex flex-row p-3 pl-2 items-center">
        <img src="/icons/weaver-logo.svg" alt="" className="w-[40px] inline-block mr-2" />
        <h1 className="font-raleway text-lg font-semibold">WEAVER</h1>
      </div>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className={`group text-light-black p-2 flex items-center leading-none rounded hover:text-primary-purple ${
            activeView === 'home' ? 'bg-primary-purple/10 font-semibold text-primary-purple' : 'hover:bg-hover-gray'
          }`}
        >
          <span
            className={`mr-2 mb-[1px] inline-block h-5 w-5 [mask-image:url('/icons/home.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
              activeView === 'home' ? 'bg-primary-purple' : 'bg-text-gray group-hover:bg-primary-purple'
            }`}
          />
          Home
        </button>
        <button
          type="button"
          onClick={() => setActiveView('workspace')}
          className={`group text-light-black p-2 flex items-center leading-none rounded hover:text-primary-purple ${
            activeView === 'workspace' ? 'bg-primary-purple/10 font-semibold text-primary-purple' : 'hover:bg-hover-gray'
          }`}
        >
          <span
            className={`mr-2 mb-[-1px] inline-block h-5 w-5 [mask-image:url('/icons/grid.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
              activeView === 'workspace' ? 'bg-primary-purple' : 'bg-text-gray group-hover:bg-primary-purple'
            }`}
          />
          Workspaces
        </button>
        <a className="group text-light-black p-2 flex items-center leading-none hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 mb-[1px] inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/archive.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Archives
        </a>
        <a className="group text-light-black p-2 flex items-center leading-none hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 mb-[1px] inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/star.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Favorites
        </a>
      </div>
      <div className="relative mt-auto border-t border-border-subtle pt-2">
        <button
          type="button"
          onClick={() => setIsAccountMenuOpen((open) => !open)}
          className="flex w-full flex-row p-2 text-light-black items-center leading-none hover:bg-hover-gray hover:text-primary-purple rounded cursor-pointer"
        >
          <img src="/icons/user.svg" alt="" className="w-5 h-5 mr-2" />
          {profile.name || 'Account'}
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
                    className="flex rounded w-full items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray hover:text-primary-purple"
                  >
                    Account
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('appearance')}
                    className="flex rounded w-full items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray hover:text-primary-purple"
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
    </div>
  );
}
