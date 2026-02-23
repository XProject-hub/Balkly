import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function BabyKidsPage() {
  return (
    <CategoryListingsPage
      slug="baby-kids"
      title="Djeca i igračke"
      subtitle="Igračke, odjeća, kolica, auto sjedalice i dječija oprema"
      gradient="linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)"
      extraFilters={[
        {
          label: "Kategorija",
          key: "baby_category",
          options: [
            { value: "toys", label: "Igračke i igre" },
            { value: "clothing", label: "Odjeća i obuća" },
            { value: "strollers", label: "Kolica i nosiljke" },
            { value: "car-seats", label: "Auto sjedalice" },
            { value: "furniture", label: "Dječiji namještaj" },
            { value: "books", label: "Knjige i edukacija" },
            { value: "school", label: "Školski pribor" },
          ],
        },
        {
          label: "Uzrast",
          key: "age_group",
          options: [
            { value: "0-12m", label: "0–12 mjeseci" },
            { value: "1-3y", label: "1–3 godine" },
            { value: "3-6y", label: "3–6 godina" },
            { value: "6-12y", label: "6–12 godina" },
            { value: "12+", label: "12+ godina" },
          ],
        },
      ]}
    />
  );
}
