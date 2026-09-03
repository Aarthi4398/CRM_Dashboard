"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Banknote, ChartSpline, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Copy, CreditCard, MoreHorizontal, Plus, Search, Send, Shield, SlidersHorizontal, Wallet } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const income = [9200, 6200, 13800, 7400, 9200, 9900, 6800, 11600, 8900, 12400, 7500, 6200];
const expense = [6500, 4200, 9300, 5100, 6500, 7100, 4700, 7900, 6200, 8300, 5200, 4300];
const people = [
  {name:"Mei Chen",sprite:"primary",position:"0%"},
  {name:"James Lewis",sprite:"primary",position:"20%"},
  {name:"Simone Avery",sprite:"primary",position:"40%"},
  {name:"Rafael Kim",sprite:"primary",position:"60%"},
  {name:"Arjun Thomas",sprite:"primary",position:"80%"},
  {name:"Natalie Price",sprite:"primary",position:"100%"},
  {name:"Marcus Reed",sprite:"more",position:"0%"},
  {name:"Daniel Cho",sprite:"more",position:"33.333%"},
  {name:"Helen Foster",sprite:"more",position:"66.667%"},
  {name:"Priya Shah",sprite:"more",position:"100%"},
];
const virtualCards = [
  {name:"Musharof Chy",number:"4983",exp:"09/29",cvc:"659"},
  {name:"Aarthi R",number:"8910",exp:"12/30",cvc:"284"},
];
const transactions = [
  ["NIV_034834", "Hotel Booking", "$9,234.87", "15 Mar, 2028 08:22 AM", "Completed"],
  ["NIV_034345", "Online Shopping", "$4,567.23", "28 Feb, 2028 09:15 AM", "Completed"],
  ["NIV_034344", "Flight Ticket", "$2,210.30", "25 Feb, 2028 10:42 AM", "Pending"],
  ["NIV_034343", "Netflix Subscription", "$36.24", "18 Feb, 2028 11:10 AM", "Completed"],
];

function TinyTrend() {
  return <svg viewBox="0 0 170 70" className="finance-spark" aria-label="Balance trend"><defs><linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#465fff" stopOpacity=".3"/><stop offset="1" stopColor="#465fff" stopOpacity="0"/></linearGradient></defs><path d="M2 56 C18 55 28 52 42 54 S63 56 78 53 96 55 108 53 123 48 135 50 151 48 168 50 L168 70 2 70Z" fill="url(#balance-fill)"/><path d="M2 56 C18 55 28 52 42 54 S63 56 78 53 96 55 108 53 123 48 135 50 151 48 168 50" fill="none" stroke="#465fff" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function FinanceDropdown({label,value,options,onChange,icon}:{label:string;value:string;options:string[];onChange:(value:string)=>void;icon?:React.ReactNode}){const [open,setOpen]=useState(false);return <div className="finance-dropdown"><button type="button" aria-label={label} aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{icon}<span>{value}</span><ChevronDown/></button>{open&&<div className="finance-dropdown-menu" role="menu">{options.map(option=><button type="button" role="menuitem" key={option} onClick={()=>{onChange(option);setOpen(false)}}><span>{option}</span>{option===value&&<Check/>}</button>)}</div>}</div>}

function VirtualTransactionIcon({type}:{type:string}){
  if(type==="Payment Received") return <i className="transaction-brand wise" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 5h14l-4.2 4 2.2 2-4.3 8H8.4l4.1-7.3L9.8 9.2 5 5Z"/></svg></i>;
  if(type==="Netflix Subscription") return <i className="transaction-brand netflix" aria-hidden="true"><b>N</b></i>;
  if(type==="Google Ads") return <i className="transaction-brand google-ads" aria-hidden="true"><svg viewBox="0 0 24 24"><path className="ads-blue" d="M8.3 17.8 14.9 5.9a3.1 3.1 0 0 1 5.4 3.1l-6.7 11.7Z"/><path className="ads-yellow" d="M8.3 17.8 3.7 9.6a3.1 3.1 0 0 1 5.4-3.1l4.5 8.1Z"/><circle className="ads-green" cx="6.2" cy="18.7" r="3.1"/></svg></i>;
  return <i className="transaction-brand paypal" aria-hidden="true"><b>P</b></i>;
}

export default function FinancePage() {
  const [currency, setCurrency] = useState("USD");
  const [month, setMonth] = useState("June 2025");
  const [period, setPeriod] = useState("3 Month");
  const [year, setYear] = useState("2025");
  const [spendingPeriod, setSpendingPeriod] = useState("Yearly");
  const [sendFrom, setSendFrom] = useState("Visa •••• •••• 3657");
  const [selectedPerson, setSelectedPerson] = useState(0);
  const [card, setCard] = useState(0);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const peopleRowRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => transactions.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  const alert = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(""), 2200); };
  const scrollPeople = () => {
    const row = peopleRowRef.current;
    if (!row) return;
    const maxScroll = row.scrollWidth - row.clientWidth;
    row.scrollTo({left: row.scrollLeft + 120 >= maxScroll ? 0 : row.scrollLeft + 120, behavior:"smooth"});
  };

  return <main className="finance-page">
    {notice && <div className="finance-toast" role="status">{notice}</div>}
    <section className="finance-top-grid">
      <article className="finance-balance-card">
        <div className="finance-balance-main">
          <div className="finance-card-head"><div><h2>Total Balance</h2><p>Overview of your current funds</p></div><div className="finance-selects"><FinanceDropdown label="Currency" value={currency} options={["USD","EUR","GBP"]} onChange={setCurrency} icon={<span className={`finance-currency-flag ${currency.toLowerCase()}`}/>}/><FinanceDropdown label="Month" value={month} options={["June 2025","May 2025","April 2025"]} onChange={setMonth}/></div></div>
          <div className="finance-balance-row"><div><strong>19,857.00</strong><span><ArrowUp/> 3.2% <em>than last month</em></span></div><TinyTrend/></div>
          <div className="finance-account"><span>Primary Account: <b>•••• •••• •••• 5332</b></span><div><button aria-label="Copy account number" onClick={() => { navigator.clipboard?.writeText("5332"); alert("Account number copied"); }}><Copy/></button><button onClick={() => alert("Account details opened")}>See Details</button></div></div>
        </div>
        <div className="finance-actions"><button onClick={() => alert("Transfer panel opened")}><ArrowUp/>Transfer</button><button onClick={() => alert("Receive panel opened")}><ArrowDown/>Received</button><button aria-label="Add account" onClick={() => alert("Add account opened")}><Plus/></button></div>
      </article>
      <section className="finance-kpis" aria-label="Finance summary">
        <FinanceKpi icon={<Wallet/>} tone="violet" title="Total Balance" value="$24,830" change="3.2%" caption="than last month" />
        <FinanceKpi icon={<ChartSpline/>} tone="green" title="Monthly Income" value="$5,200" change="3.2%" caption="than last month" negative />
        <FinanceKpi icon={<CreditCard/>} tone="orange" title="Total Spent" value="$3,831" change="295" caption="than last month" />
        <FinanceKpi icon={<span className="finance-shield-dollar"><Shield/><b>$</b></span>} tone="pink" title="Saving Rate" value="26.1%" change="" caption="Goal: 30% · 3.9% to go" ring />
      </section>
    </section>

    <section className="finance-middle-grid">
      <article className="finance-panel finance-cashflow"><div className="finance-card-head"><h2>Cashflow Overview</h2><div className="finance-selects"><FinanceDropdown label="Cashflow year" value={year} options={["2025","2024"]} onChange={setYear}/><FinanceDropdown label="Cashflow period" value={period} options={["3 Month","6 Month","Yearly"]} onChange={setPeriod}/></div></div><div className="finance-cash-summary"><div><span>Total Revenue</span><strong>$9,758.00</strong><small><ArrowUp/> 7.96%</small></div><div className="finance-legend"><span><i className="income"/>Income</span><span><i className="expense"/>Expense</span></div></div><BarChart/></article>
      <aside className="finance-panel finance-card-column"><div className="finance-card-head"><h2>My Cards</h2><button onClick={() => alert("Add card opened")}><Plus/> Add Card</button></div><BankCard card={virtualCards[card]}/><div className="virtual-nav"><b><CreditCard/>Virtual Card</b><span><button aria-label="Previous card" disabled={card===0} onClick={()=>setCard(value=>Math.max(0,value-1))}><ChevronLeft/></button><button aria-label="Next card" disabled={card===virtualCards.length-1} onClick={()=>setCard(value=>Math.min(virtualCards.length-1,value+1))}><ChevronRight/></button></span></div><div className="mini-transactions"><p>Recent Transactions</p>{[["Payment Received","+$120.00","Mar 20","Cashback from Stellar Rewards"],["Netflix Subscription","-$36.24","Sep 18","September subscription charge"],["Money received","+$590","Feb 12","Payment received via PayPal"],["Google Ads","+$236.24","Jan 28","Payment received form google ads"],["Money received","+$1,093","Jan 10","Payment received via PayPal"]].map(x=><button key={`${x[0]}-${x[2]}`} onClick={()=>alert(`${x[0]} selected`)}><VirtualTransactionIcon type={x[0]}/><span><b>{x[0]}</b><small>{x[3]}</small></span><span className="mini-amount"><em className={x[1].startsWith("+")?"positive":"negative"}>{x[1]}</em><small>{x[2]}</small></span><ChevronRight/></button>)}</div><button className="all-transactions" onClick={()=>document.getElementById("recent-transactions")?.scrollIntoView({behavior:"smooth"})}>See All Transactions</button></aside>
    </section>

    <section className="finance-lower-grid">
      <article className="finance-panel finance-spending"><div className="finance-card-head"><h2>Spending</h2><FinanceDropdown label="Spending period" value={spendingPeriod} options={["Yearly","Monthly"]} onChange={setSpendingPeriod}/></div><span>Total</span><strong>$10,758</strong><div className="spending-bar"><i/><i/><i/><i/><i/><i/></div><div className="spending-legend">{["Activity","Online Purchases","Groceries","Digital Goods","Stationery","Others"].map(x=><span key={x}><i/>{x}</span>)}</div></article>
      <article className="finance-panel quick-send"><h2>Quick send</h2><div className="people-carousel"><div className="people-row" ref={peopleRowRef}>{people.map((person,i)=><button type="button" key={person.name} className={i===selectedPerson?"active":""} aria-label={`Send to ${person.name}`} aria-pressed={i===selectedPerson} onClick={()=>setSelectedPerson(i)}><span className={`quick-avatar ${person.sprite}`} style={{backgroundPosition:`${person.position} center`}} aria-hidden="true"/></button>)}</div><button type="button" className="quick-next" aria-label="Show more recipients" onClick={scrollPeople}><ChevronRight/></button></div><label><span><CreditCard/>Send From</span><FinanceDropdown label="Send from card" value={sendFrom} options={["Visa •••• •••• 3657","Mastercard •••• 4983"]} onChange={setSendFrom}/></label><div className="quick-fields"><label><span><CircleDollarSign/>Currency</span><FinanceDropdown label="Send currency" value={currency} options={["USD","EUR"]} onChange={setCurrency} icon={<span aria-hidden="true">$</span>}/></label><label><span><Banknote/>Amount</span><input type="number" placeholder="0.00"/></label></div><button className="send-money" onClick={()=>alert(`Money sent to ${people[selectedPerson].name}`)}><Send/> Send Money</button></article>
    </section>

    <section id="recent-transactions" className="finance-panel finance-table-card"><div className="finance-table-head"><div><h2>Recent Transactions</h2><p>Your latest account activity</p></div><div><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..."/></label><button className="font-normal" onClick={()=>alert("Filters opened")}><SlidersHorizontal/>Filter</button></div></div><div className="finance-table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all"/></th><th>Order ID</th><th>Activity</th><th>Price</th><th>Date</th><th>Status</th><th/></tr></thead><tbody>{filtered.map(row=><tr key={row[0]}><td><input type="checkbox" aria-label={`Select ${row[0]}`}/></td>{row.map((cell,i)=><td key={cell}>{i===4?<span className={`finance-status ${cell.toLowerCase()}`}>{cell}</span>:cell}</td>)}<td><button aria-label={`Actions for ${row[0]}`}><MoreHorizontal/></button></td></tr>)}</tbody></table></div></section>
  </main>;
}

function FinanceKpi({icon,tone,title,value,change,caption,negative,ring}:{icon:React.ReactNode;tone:string;title:string;value:string;change:string;caption:string;negative?:boolean;ring?:boolean}) { return <article className="finance-kpi"><div className={`finance-kpi-icon ${tone}`}>{icon}</div><div><span>{title}</span><strong>{value}</strong>{ring?<small>{caption}</small>:<small className={negative?"negative":"positive"}>{negative?<ArrowDown/>:<ArrowUp/>}{change} <em>{caption}</em></small>}</div>{ring&&<div className="saving-ring">26%</div>}</article> }
function BankCard({card}:{card:(typeof virtualCards)[number]}){const alternate=card.number!==virtualCards[0].number;return <div className={`bank-card card-${alternate?1:0}`}><span className="bank-card-pattern"/><div className="bank-card-top"><div><span className="contactless">)))</span><span className="card-active">Active</span></div><span className="mastercard"><i/><i/><small>mastercard</small></span></div><h3>{card.name}</h3><div className="bank-card-details"><span><small>Card Number</small><b>•••• •••• •••• {card.number}</b></span><span><small>EXP</small><b>{card.exp}</b></span><span><small>CVC</small><b>{card.cvc}</b></span></div></div>}
function BarChart(){return <div className="cashflow-chart"><div className="chart-grid">{[25,20,15,10,5,0].map(x=><span key={x}>{x}K</span>)}</div><div className="chart-bars">{months.map((m,i)=>{const total=income[i]+expense[i];return <div key={m}><div className="bar-stack" tabIndex={0} aria-label={`${m}: total revenue $${total.toLocaleString("en-US")}, income $${income[i].toLocaleString("en-US")}, expense $${expense[i].toLocaleString("en-US")}`}><span className="bar-tooltip"><strong>{m} Total Revenue</strong><em>${total.toLocaleString("en-US")}</em><small>Income ${income[i].toLocaleString("en-US")} · Expense ${expense[i].toLocaleString("en-US")}</small></span><i style={{height:`${expense[i]/180}px`}}/><b style={{height:`${income[i]/300}px`}}/></div><span>{m}</span></div>})}</div></div>}
