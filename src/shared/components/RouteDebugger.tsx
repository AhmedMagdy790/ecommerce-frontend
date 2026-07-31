import { useEffect } from "react";
import { router } from "@/routes"; 

export const RouteDebugger = () => {
  useEffect(() => {
    // دالة داخلية للمرور على المسارات بشكل شجري (Recursive)
    const printRoutes = (routes: any[], parentPath = "") => {
      routes.forEach((route) => {
        // تنظيف وتركيب المسار الكامل
        let currentPath = route.path || "";
        // إذا كان المسار يبدأ بـ / وكان هناك مسار أب، نقوم بضبط التداخل
        let fullPath = `${parentPath}/${currentPath}`.replace(/\/+/g, "/");
        
        if (fullPath === "") fullPath = "/";

        // طباعة المسار في الـ Console
        console.log(`📍 Route: %c${fullPath}`, "color: #10b981; font-weight: bold;", `[ID: ${route.id}]`);

        // إذا كان هناك مسارات فرعية، قم بطباعتها أيضاً
        if (route.children && route.children.length > 0) {
          printRoutes(route.children, fullPath);
        }
      });
    };

    console.log(
      "%c============= 🌐 FRONT-END ROUTE LIST ============= ", 
      "color: #3b82f6; font-weight: bold; font-size: 13px;"
    );
    
    printRoutes(router.routes);
    
    console.log(
      "%c================================================== ", 
      "color: #3b82f6; font-weight: bold; font-size: 13px;"
    );
  }, []);

  return null;
};