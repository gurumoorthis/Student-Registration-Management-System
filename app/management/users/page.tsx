import AppHeader from "@/GlobalComponents/layout/AppHeader";
import ManagementBodyLayout from "@/GlobalComponents/layout/ManagementBodyLayout";
import Users from "@/PageComponents/Users";

export default function Home() {
  return (
    <>
      <AppHeader title="Users" />
      <ManagementBodyLayout>
        <Users />
      </ManagementBodyLayout>
    </>
  );
}
