import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import AuthWrapper from "./Component/AuthWrapper";
import { useEffect, useState } from "react";
import Session from "./Utils/Session";
import MainSocket from "./Utils/MainSocket";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [mainSocket, setMainSocket] = useState(null);

  return (
    <div className="size-full min-h-screen max-h-screen min-w-screen max-w-screen overflow-auto relative overflow-hidden main-container bg-gradient-to-l from-red-100 to-blue-100">
      {/* Dot one */}
      {!authenticated && (
        <AuthWrapper
          onAuthenticated={(session) => {
            setAuthenticated(true);
            if (mainSocket === null) {
              setMainSocket(new MainSocket({ session }));
            }
          }}
        />
      )}
      <div className="rounded-full bg-sky-300 absolute p-10 left-10 top-10 border-dotted border-sky-600 border-4" />
      {/* App Container */}
      {authenticated && (
        <BrowserRouter>
          <div className="app-container bg-sky-500/[.1] rounded-md backdrop-blur-sm border-sky-500/[.5] border-0 border-solid shadow-xl relative">
            <Routes>
              <Route path="*" element={<Main socket={mainSocket} />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
