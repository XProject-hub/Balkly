import CategoryListingsPage from "@/components/CategoryListingsPage";

export default function ServicesPage() {
  return (
    <CategoryListingsPage
      slug="services"
      title="Usluge"
      subtitle="Profesionalne usluge, majstori, prijevoz i više"
      gradient="linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)"
      conditions={["Dostupno", "Na upit"]}
      extraFilters={[
        {
          label: "Vrsta usluge",
          key: "service_type",
          options: [
            { value: "cleaning", label: "Čišćenje" },
            { value: "repair", label: "Popravke i majstori" },
            { value: "transport", label: "Prijevoz i dostava" },
            { value: "beauty", label: "Ljepota i wellbeing" },
            { value: "tutoring", label: "Poduka i kursevi" },
            { value: "it", label: "IT i web" },
            { value: "events", label: "Eventi i fotografija" },
            { value: "legal", label: "Pravne i poslovne usluge" },
            { value: "health", label: "Zdravlje i medicina" },
          ],
        },
      ]}
    />
  );
}
