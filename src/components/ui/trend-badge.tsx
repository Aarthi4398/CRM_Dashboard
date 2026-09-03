import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";

type TrendBadgeProps={value:string;down?:boolean;icon?:React.ReactNode;iconStyle?:"trend"|"arrow"|"none";className?:string};

export function TrendBadge({value,down=false,icon,iconStyle="none",className=""}:TrendBadgeProps){
 const resolvedIcon=icon??(iconStyle==="arrow"?(down?<ArrowDown size={12}/>:<ArrowUp size={12}/>):iconStyle==="trend"?(down?<TrendingDown size={12}/>:<TrendingUp size={12}/>):null);
 return <span className={`badge ${down?"bg-red-50 text-red-500":"bg-emerald-50 text-emerald-600"} ${className}`}>{resolvedIcon}{value}</span>
}
