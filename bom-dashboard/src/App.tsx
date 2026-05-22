import { Routes, Route, Navigate } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import DrillthroughPage from "./pages/DrillthroughPage";
import AttachmentsPage from "./pages/AttachmentsPage";

function App() {
return (
<Routes>
<Route path="/" element={<Navigate to="/overview" replace />} />
<Route path="/overview" element={<OverviewPage />} />
<Route path="/drillthrough" element={<DrillthroughPage />} />
<Route path="/attachments" element={<AttachmentsPage />} />
</Routes>
);
}

export default App;