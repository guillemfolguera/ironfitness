import { Navbar } from "./components/ui";
import { Routes, Route } from "react-router";
import { HomePage } from './pages';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
