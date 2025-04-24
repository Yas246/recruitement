"use client";

import AddAdminForm from "@/app/components/admin/AddAdminForm";
import AdminBreadcrumb from "@/app/components/admin/AdminBreadcrumb";
import AdminPageTitle from "@/app/components/admin/AdminPageTitle";

export default function AddAdmin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Utilisateurs", href: "/dashboard/admin/users" },
          { label: "Ajouter un administrateur", href: "#" },
        ]}
      />

      <AdminPageTitle
        title="Ajouter un administrateur"
        description="Créez un nouveau compte administrateur avec les permissions appropriées."
      />

      <AddAdminForm />
    </div>
  );
}
