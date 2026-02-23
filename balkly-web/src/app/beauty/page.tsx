import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function BeautyPage() {
  return (
    <CategoryListingsPage
      slug="beauty"
      title="Kozmetika i njega"
      subtitle="Parfemi, make-up, njega kože i kose"
      gradient="linear-gradient(135deg, #701a75 0%, #be185d 100%)"
      extraFilters={[
        {
          label: "Kategorija",
          key: "beauty_category",
          options: [
            { value: "skincare", label: "Njega kože" },
            { value: "makeup", label: "Šminka" },
            { value: "haircare", label: "Njega kose" },
            { value: "perfume", label: "Parfemi" },
            { value: "nailcare", label: "Njega noktiju" },
            { value: "bodycare", label: "Njega tijela" },
            { value: "tools", label: "Pribor i oprema" },
          ],
        },
      ]}
    />
  );
}
