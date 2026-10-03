import { useEffect, useRef, useState } from 'react';
import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';

interface BrowserModuleProps {
  module: WorkspaceModule;
}

function BrowserModule({ module }: BrowserModuleProps) {
  const addBrowserTab = useWorkspaceStore((state) => state.addBrowserTab);
  const closeBrowserTab = useWorkspaceStore((state) => state.closeBrowserTab);
  const setActiveBrowserTab = useWorkspaceStore((state) => state.setActiveBrowserTab);
  const navigateBrowserTab = useWorkspaceStore((state) => state.navigateBrowserTab);
  const updateBrowserTabMeta = useWorkspaceStore((state) => state.updateBrowserTabMeta);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const accentColor = workspaces.find((w) => w.id === activeWorkspaceId)?.accentColor ?? '#6366F1';
  const tabs = module.tabs ?? [];
  const activeTabId = module.activeTabId ?? tabs[0]?.id;
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const webviewRef = useRef<import('electron').WebviewTag>(null);
  const [urlDraft, setUrlDraft] = useState(activeTab?.url ?? '');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    setUrlDraft(activeTab?.url ?? '');
  }, [activeTab?.id, activeTab?.url]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !activeTab) return;

    const syncNavState = () => {
      navigateBrowserTab(module.id, activeTab.id, webview.getURL());
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
    };
    const handleTitle = (e: Electron.PageTitleUpdatedEvent) =>
      updateBrowserTabMeta(module.id, activeTab.id, { title: e.title });
    const handleFavicon = (e: Electron.PageFaviconUpdatedEvent) =>
      updateBrowserTabMeta(module.id, activeTab.id, { favicon: e.favicons[0] });

    webview.addEventListener('did-navigate', syncNavState);
    webview.addEventListener('did-navigate-in-page', syncNavState);
    webview.addEventListener('page-title-updated', handleTitle);
    webview.addEventListener('page-favicon-updated', handleFavicon);

    return () => {
      webview.removeEventListener('did-navigate', syncNavState);
      webview.removeEventListener('did-navigate-in-page', syncNavState);
      webview.removeEventListener('page-title-updated', handleTitle);
      webview.removeEventListener('page-favicon-updated', handleFavicon);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id, activeTab?.id, Boolean(activeTab?.url)]);

  const handleAddTab = () => addBrowserTab(module.id, '');

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !activeTab) return;
    const value = urlDraft.trim();
    if (!value) return;
    const url = /^https?:\/\//.test(value) ? value : `https://${value}`;
    navigateBrowserTab(module.id, activeTab.id, url);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden font-roboto">
      <div className="flex items-center gap-1 border-b border-border-subtle bg-secondary-gray px-1 pt-1 text-sm font-roboto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveBrowserTab(module.id, tab.id)}
            className={`flex max-w-[160px] items-center gap-1.5 rounded-t-md px-3 py-1.5 cursor-default ${
              tab.id === activeTabId ? 'bg-white' : 'hover:bg-hover-gray/60'
            }`}
          >
            {tab.favicon ? (
              <img src={tab.favicon} alt="" className="h-3.5 w-3.5 shrink-0 rounded-sm" />
            ) : (
              <span className="h-3.5 w-3.5 shrink-0 rounded-sm bg-border-subtle" />
            )}
            <span className="truncate text-xs">{tab.title || tab.url || 'New Tab'}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeBrowserTab(module.id, tab.id);
              }}
              className="ml-auto shrink-0 rounded px-1 text-text-gray hover:bg-hover-gray hover:text-light-black cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTab}
          className="shrink-0 rounded-md p-1.5 text-text-gray hover:bg-hover-gray hover:text-light-black cursor-pointer"
        >
          +
        </button>
      </div>
      {activeTab && (
        <div className="border-b border-border-subtle p-1.5">
          <div
            style={{ '--accent': accentColor } as React.CSSProperties}
            className="flex items-center gap-0.5 rounded-full border border-border-subtle bg-secondary-gray pr-2 transition-colors focus-within:border-[var(--accent)] focus-within:bg-white"
          >
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => webviewRef.current?.goBack()}
              className="shrink-0 rounded-full p-1.5 hover:bg-hover-gray disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <img src="/icons/left-arrow.svg" alt="" className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={!canGoForward}
              onClick={() => webviewRef.current?.goForward()}
              className="shrink-0 rounded-full p-1.5 hover:bg-hover-gray disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <img src="/icons/right-arrow.svg" alt="" className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => webviewRef.current?.reload()}
              className="shrink-0 rounded-full p-1.5 hover:bg-hover-gray cursor-pointer"
            >
              <img src="/icons/refresh.svg" alt="" className="h-3 w-3" />
            </button>
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={handleUrlSubmit}
              placeholder="Enter a URL and press Enter"
              className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
        </div>
      )}
      {activeTab?.url ? (
        <webview ref={webviewRef} src={activeTab.url} className="flex-1" />
      ) : (
        <p className="flex-1 p-2 text-sm text-text-gray">
          {activeTab ? 'Enter a URL above to browse' : 'Click + to add a tab'}
        </p>
      )}
    </div>
  );
}

export default BrowserModule;
