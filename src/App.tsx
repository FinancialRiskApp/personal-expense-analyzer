import LayoutSideBar from "./dashboard/sidebar/LayoutSideBar";
import Dashboard from "./dashboard/Dashboard";

function App() {
  return (
    <div className="container items-center m-auto max-w-[90vw]">
      <LayoutSideBar>
        <Dashboard />
      </LayoutSideBar>
    </div>
  );
}

export default App;
