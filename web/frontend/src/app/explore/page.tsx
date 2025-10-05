import { ExploreClient } from "../../components/explore-client";
import { getPlanets } from "@/lib/utils/get-planets";

interface ExplorePageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "18", 10);
  const skip = (page - 1) * limit;

  const planets = await getPlanets(limit, skip);

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl tracking-tight">
            Explore Exoplanets
          </h1>
          <p className="text-muted-foreground text-md">
            Browse a page of confirmed planets from NASA’s archive. Use filters
            to refine by disposition, name, and key parameters; sort to compare
            populations.
          </p>
        </div>

        <ExploreClient
          initialPlanets={planets}
          currentPage={page}
          limit={limit}
        />
      </div>
    </main>
  );
}
