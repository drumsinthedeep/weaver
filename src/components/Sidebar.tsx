export default function Sidebar() {
  return (
    <div className="flex flex-col gap-2 bg-white border-r border-border-subtle p-2 ml-[-14px] sticky top-0 z-10 h-screen w-[200px]">
      <div className="flex flex-row p-3 pl-2 items-center">
        <img src="/icons/weaver-logo.svg" alt="" className="w-[40px] inline-block mr-2" />
        <h1 className="font-raleway text-lg font-semibold">WEAVER</h1>
      </div>
      <div className="flex flex-col">
        <a className="group text-light-black p-2 flex items-center hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/home.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Home
        </a>
        <a className="group text-light-black  p-2 flex items-center hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/grid.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Workspaces
        </a>
        <a className="group text-light-black  p-2 flex items-center hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/archive.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Archives
        </a>
        <a className="group text-light-black p-2 flex items-center hover:bg-hover-gray hover:text-primary-purple rounded" href="#">
          <span className="mr-2 inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/star.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Favorites
        </a>
      </div>
      <div className="flex flex-col mt-auto border-t border-border-subtle">
        <button className="group cursor-pointer text-light-black p-2 flex items-center hover:bg-hover-gray hover:text-primary-purple rounded">
          <span className="mr-2 inline-block h-5 w-5 bg-text-gray group-hover:bg-primary-purple [mask-image:url('/icons/settings.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          Settings
        </button>
        <div className="flex flex-row p-2 text-light-black items-center hover:bg-hover-gray hover:text-primary-purple rounded cursor-pointer">
          <img src="/icons/user.svg" alt="" className="w-5 h-5 mr-2" />
          username
        </div>
      </div>
    </div>
  );
}
