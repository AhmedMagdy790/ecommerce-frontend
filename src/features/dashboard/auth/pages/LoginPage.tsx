import PageMeta from "@/shared/components/dashboard/common/PageMeta";
import AuthPageLayout from "../components/AuthPageLayout";
import LoginForm from "@/shared/components/dashboard/auth/LoginForm";



export default function LoginPage() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthPageLayout>
        <LoginForm />
      </AuthPageLayout>
    </>
  );
}
