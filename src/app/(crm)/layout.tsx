import { PageContext } from "@/components/page-context";
import { Shell } from "@/components/shell";
import { StoreProvider } from "@/lib/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Shell>
        <PageContext>{children}</PageContext>
      </Shell>
    </StoreProvider>
  );
}
