import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function SportsPage() {
  return (
    <CategoryListingsPage
      slug="sports"
      title="Sport i hobi"
      subtitle="Sportska oprema, bicikli, hobiji i slobodno vrijeme"
      gradient="linear-gradient(135deg, #14532d 0%, #15803d 100%)"
      extraFilters={[
        {
          label: "Kategorija",
          key: "sport_type",
          options: [
            { value: "football", label: "Fudbal" },
            { value: "basketball", label: "Košarka" },
            { value: "tennis", label: "Tenis" },
            { value: "cycling", label: "Biciklizam" },
            { value: "gym", label: "Teretana" },
            { value: "swimming", label: "Plivanje" },
            { value: "winter", label: "Zimski sportovi" },
            { value: "martial-arts", label: "Borilačke vještine" },
            { value: "hobbies", label: "Hobiji" },
          ],
        },
      ]}
    />
  );
}
