import CatalogGrid from "../components/CatalogGrid";
import CategoryTabs from "../components/CategoryTabs";
import { catalogData } from "../../lib/data";

export const metadata = { title: "Collections", description: "Every Stride sneaker in one place: collaborations, lab concepts and hand-finished luxury low-tops." };

export default function CollectionsPage() {
  return (
    <main className="pt-16">
      <CatalogGrid
        products={catalogData}
        eyebrow={`${catalogData.length} styles`}
        heading="The Collection"
        intro="Collaborations, lab concepts and quiet luxury: every pair we make, in one place."
        nav={<CategoryTabs />}
        level={1}
        sortable
      />
    </main>
  );
}
