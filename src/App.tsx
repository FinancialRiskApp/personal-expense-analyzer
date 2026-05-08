import LayoutSideBar from "./dashboard/sidebar/LayoutSideBar";
import Dashboard from "./dashboard/Dashboard";

function App() {
  return (
    <div className="container items-center mx-auto max-w-[80vw]">
      <LayoutSideBar>
        <Dashboard />
      </LayoutSideBar>
    </div>
  );
}

export default App;
