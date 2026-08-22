interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onAddModule: () => void;
}

export default function Header({ onAddModule, ...rest }: HeaderProps) {
  return (
    <div className="flex items-center sticky top-0 z-10 justify-between bg-white border-b border-border-subtle px-4 py-2 mx-[-14px]" {...rest}>
      <h1 className="text-lg font-semibold text-text-gray">Workspace</h1>
      <button
        onClick={onAddModule}
        className="flex items-center gap-2 rounded-md bg-primary-purple px-[14px] py-[6px] text-sm font-medium text-white hover:bg-primary-purple/90"
      >
        <img src="/icons/add.svg" alt="" className="w-4" />
        Add Module
      </button>
    </div>
  );
}
