import { Routes, Route, Navigate } from "react-router-dom";

import OverviewPage from "./pages/OverviewPage";
import DrillthroughPage from "./pages/DrillthroughPage";
import OorPage from "./pages/OorPage";

function App(){

return(

<Routes>

<Route
path="/"
element={<Navigate to="/overview" replace />}
/>

<Route
path="/overview"
element={<OverviewPage />}
/>

<Route
path="/drillthrough/:id"
element={<DrillthroughPage />}
/>

<Route
path="/oor"
element={<OorPage />}
/>

</Routes>

);

}

export default App;