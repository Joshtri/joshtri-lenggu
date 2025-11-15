import ShortcutEdit from "@/components/features/settings/shortcuts/edit";

interface EditShortcutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditShortcutPage({
  params,
}: EditShortcutPageProps) {
  const { id } = await params;
  return <ShortcutEdit shortcutId={id} />;
}
