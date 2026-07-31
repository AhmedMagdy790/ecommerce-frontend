import PageMeta from "@/shared/components/dashboard/common/PageMeta";
import AuthPageLayout from "../components/AuthPageLayout";
import RegisterForm from "@/shared/components/dashboard/auth/RegisterForm";



export default function RegisterPage() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthPageLayout>
        <RegisterForm />
      </AuthPageLayout>
    </>
  );
}
