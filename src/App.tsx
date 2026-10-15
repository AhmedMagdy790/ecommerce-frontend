import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { Toaster } from "react-hot-toast";


function App() {


  return (
    <>
      <RouterProvider router={router} />
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