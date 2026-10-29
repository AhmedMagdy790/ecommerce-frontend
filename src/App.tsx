import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { Toaster } from "react-hot-toast";
import { GlobalErrorRenderer } from "./shared/components/feedback/GlobalErrorDialog";


function App() {


  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorRenderer />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            zIndex: 999999999,
          },
        }}
        containerStyle={{
          zIndex: 999999999,
        }}
      />
    </>
  );
}

export default App;