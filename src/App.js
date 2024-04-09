import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./pages/main/main"

function App() {
    return(
        <Router>
            <Routes>
                {/* Rota para o index */}
                <Route path="/" element={<Main />} />
            </Routes>
        </Router>
    )
}

export default App;