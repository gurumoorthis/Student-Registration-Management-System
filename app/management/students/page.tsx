import AppHeader from "@/GlobalComponents/layout/AppHeader";
import ManagementBodyLayout from "@/GlobalComponents/layout/ManagementBodyLayout";
import Students from "@/PageComponents/Students";

export default function Home() {
  return (
    <>
      <AppHeader title="Students" />
      <ManagementBodyLayout>
        <Students />
      </ManagementBodyLayout>
    </>
  );
}
