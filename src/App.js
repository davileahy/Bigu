import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Main from "./pages/main/main";
import Landing from './pages/landing';

function App() {
    return(

        <Router>
         <Routes>

            <Route path="/main" element={<Main />} />
            <Route path="/" element={<Landing />} />

         </Routes>
      </Router>

    );
  }


export default App;