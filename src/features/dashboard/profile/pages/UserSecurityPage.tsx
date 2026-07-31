export default function UserSecurityPage() {
  return (
    <div className="max-w-2xl space-y-6">
       <h3 className="text-xl font-bold text-gray-800 dark:text-white">إعدادات الأمان</h3>
       <ChangePasswordForm /> {/* فورم تغيير الباسورد */}
    </div>
  );
}