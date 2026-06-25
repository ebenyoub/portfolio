import { useLocation } from "react-router-dom";
import App from "../App";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";
  const showPublicChrome = !isAdminRoute && !isAuthRoute;

  if (!showPublicChrome) {
    return <App />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <App />
      </main>
      <Footer />
    </div>
  );
}
