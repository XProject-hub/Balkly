import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function HomeGardenPage() {
  return (
    <CategoryListingsPage
      slug="home-garden"
      title="Dom i vrt"
      subtitle="Namještaj, dekor, kuhinjski aparati i vrtna oprema"
      gradient="linear-gradient(135deg, #78350f 0%, #d97706 100%)"
      extraFilters={[
        {
          label: "Kategorija",
          key: "home_category",
          options: [
            { value: "furniture", label: "Namještaj" },
            { value: "lighting", label: "Rasvjeta" },
            { value: "kitchen", label: "Kuhinja i trpezarija" },
            { value: "bedding", label: "Posteljina i kupatilo" },
            { value: "garden", label: "Vrt i terasa" },
            { value: "storage", label: "Organizacija i odlaganje" },
            { value: "decor", label: "Dekor" },
            { value: "appliances", label: "Kućanski aparati" },
            { value: "diy", label: "Alati i DIY" },
          ],
        },
      ]}
    />
  );
}
