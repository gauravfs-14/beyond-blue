import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Hello World</h1>
      <Button>Surprise Me 🎊</Button>
    </div>
  );
}
