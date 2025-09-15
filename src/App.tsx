import { AppProviders } from "@/app/AppProviders";
import { AppRoutes } from "@/app/AppRoutes";

const App = () => (
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);

export default App;
