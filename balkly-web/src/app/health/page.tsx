import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function HealthPage() {
  return (
    <CategoryListingsPage
      slug="health"
      title="Zdravlje i wellness"
      subtitle="Medicinska oprema, suplementi, fitness i wellbeing"
      gradient="linear-gradient(135deg, #065f46 0%, #059669 100%)"
      extraFilters={[
        {
          label: "Kategorija",
          key: "health_category",
          options: [
            { value: "medical", label: "Medicinska oprema" },
            { value: "supplements", label: "Suplementi i vitamini" },
            { value: "fitness", label: "Fitness oprema" },
            { value: "mobility", label: "Pomagala za kretanje" },
            { value: "vision", label: "Vid i naočale" },
            { value: "first-aid", label: "Prva pomoć" },
            { value: "wellness", label: "Wellness i spa" },
          ],
        },
      ]}
    />
  );
}
