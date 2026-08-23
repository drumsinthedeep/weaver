export default function Sidebar() {
  return (
    <div className="flex flex-col gap-2 justify-between bg-white border-r border-border-subtle p-2 ml-[-14px] sticky top-0 z-10 h-screen w-[200px]">
      <div className="flex flex-col border-b border-border-subtle px-2">
        <h1>WEAVER</h1>
      </div>
      <div className="flex flex-col border-b border-border-subtle">
        <a className="px-2 py-1 hover:bg-gray-100 rounded" href="#">HOME</a>
        <a className="px-2 py-1 hover:bg-gray-100 rounded" href="#">WORKSPACES</a>
        <a className="px-2 py-1 hover:bg-gray-100 rounded" href="#">ARCHIVES</a>
      </div>
      <div className="flex flex-col px-2">
        Settings
        <div className="flex flex-row">
          <img></img>
          username
        </div>
      </div>
    </div>
  );
}
