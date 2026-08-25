export default function Sidebar() {
  return (
    <div className="flex flex-col gap-2 bg-white border-r border-border-subtle p-2 ml-[-14px] sticky top-0 z-10 h-screen w-[200px]">
      <div className="flex flex-row p-3 pl-2 items-center">
        <img src="/icons/weaver-logo.png" alt="" className="w-[40px] inline-block mr-2" />
        <h1>WEAVER</h1>
      </div>
      <div className="flex flex-col">
        <a className="p-2 flex hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <img src="/icons/home.svg" alt="" className="w-[20px] inline-block mr-2" />
          HOME
        </a>
        <a className="p-2 flex hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <img src="/icons/grid.svg" alt="" className="w-[20px] inline-block mr-2" />
          WORKSPACES
        </a>
        <a className="p-2 flex hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <img src="/icons/archive.svg" alt="" className="w-[20px] inline-block mr-2" />
          ARCHIVES
        </a>
        <a className="p-2 flex hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <img src="/icons/heart.svg" alt="" className="w-[20px] inline-block mr-2" />
          FAVORITES
        </a>
      </div>
      <div className="flex flex-col p-2 mt-auto border-t border-border-subtle">
        Settings
        <div className="flex flex-row">
          <img></img>
          username
        </div>
      </div>
    </div>
  );
}
