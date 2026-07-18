import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const App = () => {
  return (
    <>
      <Navbar />
      <div className="pt-18">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
