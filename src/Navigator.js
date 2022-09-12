import { BrowserRouter, Routes, Route } from "react-router-dom";
import ElevateAppBar from "./components/ElevateAppBar";
import SortTable from "./SortTable";
import DragAndDrop from "./workarea/DragAndDrop";



export default function Navigator() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<ElevateAppBar />} />
                <Route exact path="/normal" element={<SortTable />} />
                <Route exact path="/cluster" element={<DragAndDrop />} />
            </Routes>
        </BrowserRouter>
    )
}