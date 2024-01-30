import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import AuthWrapper from "./Component/AuthWrapper";
import { useEffect, useState } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div className="size-full min-h-screen max-h-screen min-w-screen max-w-screen overflow-auto relative overflow-hidden main-container bg-gradient-to-l from-red-100 to-blue-100">
      {/* Dot one */}
      <AuthWrapper onAuthenticated={() => setAuthenticated(true)} />
      <div className="rounded-full bg-sky-300 absolute p-10 left-10 top-10 border-dotted border-sky-600 border-4" />
      {/* App Container */}
      {authenticated && (
        <BrowserRouter>
          <div className="app-container bg-sky-500/[.1] rounded-md backdrop-blur-sm border-sky-500/[.5] border-0 border-solid shadow-xl relative">
            <Routes>
              <Route path="*" element={<Main />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
