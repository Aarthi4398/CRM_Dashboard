import { Shell } from "@/components/shell";
import { PageContext } from "@/components/page-context";
export default function CRMLayout({children}:{children:React.ReactNode}){return <Shell><PageContext>{children}</PageContext></Shell>}
