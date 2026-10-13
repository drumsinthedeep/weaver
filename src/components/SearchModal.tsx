import { useEffect, useMemo, useRef, useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

type ResultType = 'workspace' | 'module' | 'task' | 'bookmark' | 'file' | 'event';

interface SearchResult {
  id: string;
  type: ResultType;
  label: string;
  subtitle: string;
  workspaceId: string;
  icon: string;
  flatIndex: number;
}

const GROUP_LABELS: Record<ResultType, string> = {
  workspace: 'Workspaces',
  module: 'Modules',
  task: 'Tasks',
  bookmark: 'Bookmarks',
  file: 'Files',
  event: 'Events',
};

const GROUP_ORDER: ResultType[] = ['workspace', 'module', 'task', 'bookmark', 'file', 'event'];

function moduleIcon(type: string): string {
  return type === 'file' ? '/icons/folder.svg' : `/icons/${type}.svg`;
}

export default function SearchModal() {
  const isSearchOpen = useWorkspaceStore((state) => state.isSearchOpen);
  const openSearch = useWorkspaceStore((state) => state.openSearch);
  const closeSearch = useWorkspaceStore((state) => state.closeSearch);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  const allResults = useMemo<Omit<SearchResult, 'flatIndex'>[]>(() => {
    const items: Omit<SearchResult, 'flatIndex'>[] = [];
    for (const workspace of workspaces.filter((w) => !w.archived)) {
      items.push({
        id: workspace.id,
        type: 'workspace',
        label: workspace.name,
        subtitle: workspace.description || 'Workspace',
        workspaceId: workspace.id,
        icon: '/icons/grid.svg',
      });
      for (const module of workspace.modules) {
        items.push({
          id: module.id,
          type: 'module',
          label: module.name || module.type,
          subtitle: `${workspace.name} · ${module.type}`,
          workspaceId: workspace.id,
          icon: moduleIcon(module.type),
        });
        for (const task of module.tasks ?? []) {
          items.push({
            id: task.id,
            type: 'task',
            label: task.label,
            subtitle: `${module.name || 'Tasks'} · ${workspace.name}`,
            workspaceId: workspace.id,
            icon: '/icons/tasks.svg',
          });
        }
        for (const bookmark of module.bookmarks ?? []) {
          items.push({
            id: bookmark.id,
            type: 'bookmark',
            label: bookmark.title,
            subtitle: bookmark.url,
            workspaceId: workspace.id,
            icon: '/icons/bookmark.svg',
          });
        }
        for (const file of module.files ?? []) {
          items.push({
            id: file.id,
            type: 'file',
            label: file.name,
            subtitle: file.path,
            workspaceId: workspace.id,
            icon: '/icons/folder.svg',
          });
        }
        for (const event of module.events ?? []) {
          items.push({
            id: event.id,
            type: 'event',
            label: event.title,
            subtitle: event.location || `${module.name || 'Calendar'} · ${workspace.name}`,
            workspaceId: workspace.id,
            icon: '/icons/calendar.svg',
          });
        }
      }
    }
    return items;
  }, [workspaces]);

  const results = useMemo<SearchResult[]>(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = !trimmed
      ? allResults.filter((r) => r.type === 'workspace')
      : allResults.filter(
          (r) => r.label.toLowerCase().includes(trimmed) || r.subtitle.toLowerCase().includes(trimmed)
        );
    return filtered.map((result, index) => ({ ...result, flatIndex: index }));
  }, [allResults, query]);

  const groupedResults = useMemo(() => {
    return GROUP_ORDER.map((type) => ({
      type,
      label: GROUP_LABELS[type],
      items: results.filter((r) => r.type === type),
    })).filter((group) => group.items.length > 0);
  }, [results]);

  const handleSelect = (result: SearchResult) => {
    setActiveWorkspace(result.workspaceId);
    setActiveView('workspace');
    closeSearch();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      const result = results[selectedIndex];
      if (result) handleSelect(result);
    }
  };

  return (
    <>
      <div
        onClick={closeSearch}
        className={`fixed inset-0 z-10 bg-gray-500/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isSearchOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-24 left-1/2 z-20 w-150 -translate-x-1/2 overflow-hidden rounded-lg border border-border-subtle bg-white shadow-md transition-all duration-200 flex flex-col ${
          isSearchOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <input
          type="text"
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search workspaces, tasks, bookmarks, files, events..."
          className="w-full border-b border-border-subtle px-4 py-3 text-sm outline-none placeholder:text-text-gray"
        />
        <div className="max-h-96 overflow-auto p-2">
          {groupedResults.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-text-gray">No results</p>
          )}
          {groupedResults.map((group) => (
            <div key={group.type} className="mb-2 last:mb-0">
              <p className="mb-1 px-2 text-xs font-semibold uppercase text-text-gray">{group.label}</p>
              {group.items.map((result) => {
                const isSelected = result.flatIndex === selectedIndex;
                return (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(result.flatIndex)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm cursor-pointer ${
                      isSelected ? 'bg-hover-gray' : ''
                    }`}
                  >
                    <span className="h-4 w-4 shrink-0 bg-text-gray [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" style={{ maskImage: `url(${result.icon})` }} />
                    <span className="min-w-0 flex-1 truncate">{result.label}</span>
                    <span className="shrink-0 max-w-[160px] truncate text-xs text-text-gray">{result.subtitle}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
