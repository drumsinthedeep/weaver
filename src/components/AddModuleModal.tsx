import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function AddModuleModal() {
  const isAddModuleModalOpen = useWorkspaceStore((state) => state.isAddModuleModalOpen);
  const closeAddModuleModal = useWorkspaceStore((state) => state.closeAddModuleModal);

  return (
    <>
      <div
        onClick={closeAddModuleModal}
        className={`fixed inset-0 z-10 bg-light-black/60 transition-opacity duration-300 ${
          isAddModuleModalOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-0 right-0 z-20 h-full w-150 bg-white transition-transform duration-300 ${
          isAddModuleModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={closeAddModuleModal}>x</button>
      </div>
    </>
  );
}
