import "./App.css";
import AppRouter from "./router/routes";

function App() {
  return (
    <div className="not-first:w-full h-screen w-screen">
      <AppRouter />
    </div>
  );
}

export default App;
