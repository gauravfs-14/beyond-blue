import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-bold text-4xl">Planet Not Found</h1>
        <p className="text-muted-foreground">
          The exoplanet you're looking for doesn't exist in our database.
        </p>
        <Button asChild>
          <Link href="/explore">Browse All Planets</Link>
        </Button>
      </div>
    </main>
  );
}
