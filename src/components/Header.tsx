import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Header() {
  const openAddModuleModal = useWorkspaceStore((state) => state.openAddModuleModal);

  return (
    <div className="flex items-center sticky top-0 z-10 justify-between bg-white border-b border-border-subtle px-4 py-4 mr-[-14px]">
      <h1 className="text-lg font-semibold text-text-gray">Breadcrumbs</h1>
      <button
        onClick={openAddModuleModal}
        className="flex items-center cursor-pointer gap-2 rounded-md bg-primary-purple px-[14px] py-[9px] text-sm font-medium text-white hover:bg-primary-purple/80"
      >
        <img src="/icons/add.svg" alt="" className="w-4" />
        Add Module
      </button>
    </div>
  );
}
