import { ToastProvider } from "./components/toast/ToastContext";
import { ContentProvider } from "./pages/components/ContentProvider";

export function App() {
  return (
    <ToastProvider>
      <ContentProvider />
    </ToastProvider>
  );
}
