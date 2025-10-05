import AppHeader from "@/GlobalComponents/layout/AppHeader";
import ManagementBodyLayout from "@/GlobalComponents/layout/ManagementBodyLayout";
import Dashboard from "@/PageComponents/Dashboard";

export default function Home() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <ManagementBodyLayout>
        <Dashboard />
      </ManagementBodyLayout>
    </>
  );
}
