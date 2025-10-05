import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PlanetDetail } from "@/components/planet-detail";
import { getPlanet } from "@/lib/utils/get-planet";

interface PlanetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlanetPage({ params }: PlanetPageProps) {
  const { id } = await params;
  const planet = await getPlanet(id);

  if (!planet) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* <Button variant="ghost" size="sm" asChild>
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button> */}

        <PlanetDetail planet={planet} />
      </div>
    </main>
  );
}
