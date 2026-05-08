import { useState } from "react";

import Dashboard from "./dashboard/Dashboard";
import LayoutSideBar from "./dashboard/sidebar/LayoutSideBar";

function App() {
  const [rendaMensal, setRendaMensal] = useState(10000);

  return (
    <div className="container items-center m-auto max-w-[90vw]">
      <LayoutSideBar rendaMensal={rendaMensal} setRendaMensal={setRendaMensal}>
        <Dashboard rendaMensal={rendaMensal} />
      </LayoutSideBar>
    </div>
  );
}

export default App;
