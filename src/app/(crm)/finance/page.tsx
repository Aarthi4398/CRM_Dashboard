"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, CircleDollarSign, Copy, CreditCard, MoreHorizontal, Plus, Search, Send, SlidersHorizontal, TrendingDown, TrendingUp, WalletCards } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const income = [9200, 6200, 13800, 7400, 9200, 9900, 6800, 11600, 8900, 12400, 7500, 6200];
const expense = [6500, 4200, 9300, 5100, 6500, 7100, 4700, 7900, 6200, 8300, 5200, 4300];
const people = ["MC", "JL", "SA", "RK"];
const transactions = [
  ["NIV_034834", "Hotel Booking", "$9,234.87", "15 Mar, 2028 08:22 AM", "Completed"],
  ["NIV_034345", "Online Shopping", "$4,567.23", "28 Feb, 2028 09:15 AM", "Completed"],
  ["NIV_034344", "Flight Ticket", "$2,210.30", "25 Feb, 2028 10:42 AM", "Pending"],
  ["NIV_034343", "Netflix Subscription", "$36.24", "18 Feb, 2028 11:10 AM", "Completed"],
];

function TinyTrend() {
  return <svg viewBox="0 0 170 70" className="finance-spark" aria-label="Balance trend"><defs><linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#465fff" stopOpacity=".3"/><stop offset="1" stopColor="#465fff" stopOpacity="0"/></linearGradient></defs><path d="M2 61 C18 58 23 46 38 48 S55 62 70 47 91 28 106 34 121 43 137 23 154 17 168 6 L168 70 2 70Z" fill="url(#balance-fill)"/><path d="M2 61 C18 58 23 46 38 48 S55 62 70 47 91 28 106 34 121 43 137 23 154 17 168 6" fill="none" stroke="#465fff" strokeWidth="3" strokeLinecap="round"/></svg>;
}

export default function FinancePage() {
  const [currency, setCurrency] = useState("USD");
  const [month, setMonth] = useState("June 2025");
  const [period, setPeriod] = useState("3 Month");
  const [year, setYear] = useState("2025");
  const [card, setCard] = useState(0);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => transactions.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  const alert = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(""), 2200); };

  return <main className="finance-page">
    {notice && <div className="finance-toast" role="status">{notice}</div>}
    <section className="finance-top-grid">
      <article className="finance-balance-card">
        <div className="finance-balance-main">
          <div className="finance-card-head"><div><h2>Total Balance</h2><p>Overview of your current funds</p></div><div className="finance-selects"><select value={currency} onChange={e => setCurrency(e.target.value)} aria-label="Currency"><option value="USD">🇺🇸 USD</option><option value="EUR">🇪🇺 EUR</option><option value="GBP">🇬🇧 GBP</option></select><select value={month} onChange={e => setMonth(e.target.value)} aria-label="Month"><option>June 2025</option><option>May 2025</option><option>April 2025</option></select></div></div>
          <div className="finance-balance-row"><div><strong>{currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}19,857.00</strong><span><TrendingUp/> 3.2% <em>than last month</em></span></div><TinyTrend/></div>
          <div className="finance-account"><span>Primary Account: <b>•••• •••• •••• 5332</b></span><div><button aria-label="Copy account number" onClick={() => { navigator.clipboard?.writeText("5332"); alert("Account number copied"); }}><Copy/></button><button onClick={() => alert("Account details opened")}>See Details</button></div></div>
        </div>
        <div className="finance-actions"><button onClick={() => alert("Transfer panel opened")}><ArrowUpRight/>Transfer</button><button onClick={() => alert("Receive panel opened")}><ArrowDownLeft/>Received</button><button aria-label="Add account" onClick={() => alert("Add account opened")}><Plus/></button></div>
      </article>
      <section className="finance-kpis" aria-label="Finance summary">
        <FinanceKpi icon={<WalletCards/>} tone="violet" title="Total Balance" value="$24,830" change="3.2%" caption="than last month" />
        <FinanceKpi icon={<TrendingUp/>} tone="green" title="Monthly Income" value="$5,200" change="3.2%" caption="than last month" negative />
        <FinanceKpi icon={<CreditCard/>} tone="orange" title="Total Spent" value="$3,831" change="295" caption="than last month" />
        <FinanceKpi icon={<CircleDollarSign/>} tone="pink" title="Saving Rate" value="26.1%" change="" caption="Goal: 30% · 3.9% to go" ring />
      </section>
    </section>

    <section className="finance-middle-grid">
      <article className="finance-panel finance-cashflow"><div className="finance-card-head"><h2>Cashflow Overview</h2><div className="finance-selects"><select value={year} onChange={e=>setYear(e.target.value)}><option>2025</option><option>2024</option></select><select value={period} onChange={e=>setPeriod(e.target.value)}><option>3 Month</option><option>6 Month</option><option>Yearly</option></select></div></div><div className="finance-cash-summary"><div><span>Total Revenue</span><strong>$9,758.00</strong><small><TrendingUp/> 7.96%</small></div><div className="finance-legend"><span><i className="income"/>Income</span><span><i className="expense"/>Expense</span></div></div><BarChart/></article>
      <aside className="finance-panel finance-card-column"><div className="finance-card-head"><h2>My Cards</h2><button onClick={() => alert("Add card opened")}><Plus/> Add Card</button></div><BankCard alternate={Boolean(card)}/><div className="virtual-nav"><b>Virtual Card</b><span><button aria-label="Previous card" onClick={()=>setCard(0)}><ChevronLeft/></button><button aria-label="Next card" onClick={()=>setCard(1)}><ChevronRight/></button></span></div><div className="mini-transactions"><p>Recent Transactions</p>{[["↗","Payment Received","+$120.00"],["N","Netflix Subscription","-$36.24"],["P","Money received","+$590"],["A","Google Ads","+$236.24"]].map((x,i)=><button key={x[1]} onClick={()=>alert(`${x[1]} selected`)}><i>{x[0]}</i><span><b>{x[1]}</b><small>{i%2 ? "September subscription" : "Payment received"}</small></span><em className={x[2].startsWith("+")?"positive":"negative"}>{x[2]}</em><ChevronRight/></button>)}</div><button className="all-transactions" onClick={()=>document.getElementById("recent-transactions")?.scrollIntoView({behavior:"smooth"})}>See All Transactions</button></aside>
    </section>

    <section className="finance-lower-grid">
      <article className="finance-panel finance-spending"><div className="finance-card-head"><h2>Spending</h2><select><option>Yearly</option><option>Monthly</option></select></div><span>Total</span><strong>$10,758</strong><div className="spending-bar"><i/><i/><i/><i/><i/><i/></div><div className="spending-legend">{["Activity","Online Purchases","Groceries","Digital Goods","Stationery","Others"].map(x=><span key={x}><i/>{x}</span>)}</div></article>
      <article className="finance-panel quick-send"><h2>Quick send</h2><div className="people-row">{people.map((p,i)=><button key={p} className={i===0?"active":""}>{p}</button>)}<button><ChevronRight/></button></div><label>Send From<select><option>Visa •••• •••• 3657</option><option>Mastercard •••• 4983</option></select></label><div className="quick-fields"><label>Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}><option>USD</option><option>EUR</option></select></label><label>Amount<input type="number" placeholder="0.00"/></label></div><button className="send-money" onClick={()=>alert("Money sent successfully")}><Send/> Send Money</button></article>
    </section>

    <section id="recent-transactions" className="finance-panel finance-table-card"><div className="finance-table-head"><div><h2>Recent Transactions</h2><p>Your latest account activity</p></div><div><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..."/></label><button onClick={()=>alert("Filters opened")}><SlidersHorizontal/>Filter</button></div></div><div className="finance-table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all"/></th><th>Order ID</th><th>Activity</th><th>Price</th><th>Date</th><th>Status</th><th/></tr></thead><tbody>{filtered.map(row=><tr key={row[0]}><td><input type="checkbox" aria-label={`Select ${row[0]}`}/></td>{row.map((cell,i)=><td key={cell}>{i===4?<span className={`finance-status ${cell.toLowerCase()}`}>{cell}</span>:cell}</td>)}<td><button aria-label={`Actions for ${row[0]}`}><MoreHorizontal/></button></td></tr>)}</tbody></table></div></section>
  </main>;
}

function FinanceKpi({icon,tone,title,value,change,caption,negative,ring}:{icon:React.ReactNode;tone:string;title:string;value:string;change:string;caption:string;negative?:boolean;ring?:boolean}) { return <article className="finance-kpi"><div className={`finance-kpi-icon ${tone}`}>{icon}</div><div><span>{title}</span><strong>{value}</strong>{ring?<small>{caption}</small>:<small className={negative?"negative":"positive"}>{negative?<TrendingDown/>:<TrendingUp/>}{change} <em>{caption}</em></small>}</div>{ring&&<div className="saving-ring">26%</div>}</article> }
function BankCard({alternate}:{alternate:boolean}){return <div className={`bank-card card-${alternate?1:0}`}><span className="bank-card-pattern"/><div className="bank-card-top"><div><span className="contactless">)))</span><span className="card-active">Active</span></div><span className="mastercard"><i/><i/><small>mastercard</small></span></div><h3>{alternate?"Aarthi R":"Musharof Chy"}</h3><div className="bank-card-details"><span><small>Card Number</small><b>•••• •••• •••• {alternate?"8910":"4983"}</b></span><span><small>EXP</small><b>09/29</b></span><span><small>CVC</small><b>659</b></span></div></div>}
function BarChart(){return <div className="cashflow-chart"><div className="chart-grid">{[25,20,15,10,5,0].map(x=><span key={x}>{x}K</span>)}</div><div className="chart-bars">{months.map((m,i)=>{const total=income[i]+expense[i];return <div key={m}><div className="bar-stack" tabIndex={0} aria-label={`${m}: total revenue $${total.toLocaleString()}, income $${income[i].toLocaleString()}, expense $${expense[i].toLocaleString()}`}><span className="bar-tooltip"><strong>{m} Total Revenue</strong><em>${total.toLocaleString()}</em><small>Income ${income[i].toLocaleString()} · Expense ${expense[i].toLocaleString()}</small></span><i style={{height:`${expense[i]/180}px`}}/><b style={{height:`${income[i]/300}px`}}/></div><span>{m}</span></div>})}</div></div>}
