import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { routeTitles } from "@/lib/menu";

export default async function ConnectedDemoPage({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params; const key=slug.join("/"); const title=routeTitles.get(key);
 if(!title) notFound();
 return <CatalogPage slug={key} title={title}/>;
}
