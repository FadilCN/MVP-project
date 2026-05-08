import { Routes, Route } from "react-router-dom";

import CodeEditor from "./pages/codeEditor";
import DashBoard from "./pages/DashBoard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";


function App() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/editor" element={<CodeEditor />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;