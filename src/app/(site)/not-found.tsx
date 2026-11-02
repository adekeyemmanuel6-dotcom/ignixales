import { Btn } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-5 pt-24 text-center">
      <div><p className="label">404</p><h1 className="h-display mt-3 text-[clamp(3rem,10vw,7rem)]">This page is off the campaign.</h1>
        <p className="mx-auto mt-4 max-w-md text-mute">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3"><Btn href="/">Back home</Btn><Btn href="/work" variant="ghost">View our work</Btn></div></div>
    </section>
  );
}
