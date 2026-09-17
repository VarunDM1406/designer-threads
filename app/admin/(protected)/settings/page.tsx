import PageHeader from "@/components/ui/page-header";
import { getSettings } from "@/features/settings/actions/get-settings";
import SettingsForm from "@/features/settings/components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your store and administration settings."
      />

      <SettingsForm initialData={settings} />
    </div>
  );
}
