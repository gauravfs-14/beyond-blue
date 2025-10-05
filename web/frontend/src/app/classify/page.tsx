import { ClassifierForm } from "@/components/classifier-form";
import { Info } from "lucide-react";

export default function ClassifyPage() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-bold text-3xl tracking-tight">
            Planet Classifier
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Use our machine learning model to classify exoplanets based on their
            physical and orbital characteristics. Enter the parameters below to
            get a classification with confidence score and rationale.
          </p>

          <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">How it works</p>
              <p className="text-muted-foreground leading-relaxed">
                The classifier analyzes planetary and stellar parameters to
                determine the planet type (e.g., Gas Giant, Super-Earth,
                Terrestrial). All fields are optional, but more data improves
                accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ClassifierForm />
      </div>
    </main>
  );
}
