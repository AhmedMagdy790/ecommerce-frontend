import UserMetaCard from "../components/UserMetaCard";
import UserInfoCard from "../components/UserInfoCard";

export default function UserInfoPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UserMetaCard />
      <UserInfoCard />
    </div>
  );
}