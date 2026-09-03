import type { CRMState } from "./types";

const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==="object";
const text=(value:unknown)=>typeof value==="string";
const number=(value:unknown)=>typeof value==="number"&&Number.isFinite(value);
const strings=(value:unknown)=>Array.isArray(value)&&value.every(text);
const oneOf=<T extends string>(values:readonly T[])=>(value:unknown):value is T=>typeof value==="string"&&values.includes(value as T);

export function isCRMState(value:unknown):value is CRMState{
 if(!object(value))return false;
 const contacts=Array.isArray(value.contacts)&&value.contacts.every(v=>object(v)&&[v.id,v.name,v.role,v.company,v.email,v.phone,v.initials,v.createdAt].every(text)&&oneOf(["Active","Lead","Inactive"] as const)(v.status)&&strings(v.tags));
 const companies=Array.isArray(value.companies)&&value.companies.every(v=>object(v)&&[v.id,v.name,v.industry,v.website,v.location].every(text)&&number(v.value)&&number(v.contactCount)&&oneOf(["Customer","Prospect"] as const)(v.status));
 const deals=Array.isArray(value.deals)&&value.deals.every(v=>object(v)&&[v.id,v.title,v.company,v.contact,v.owner,v.closeDate].every(text)&&number(v.value)&&number(v.probability)&&oneOf(["Lead","Qualified","Proposal","Negotiation","Won","Lost"] as const)(v.stage));
 const tasks=Array.isArray(value.tasks)&&value.tasks.every(v=>object(v)&&[v.id,v.title,v.description,v.dueDate,v.relatedTo].every(text)&&oneOf(["Low","Medium","High"] as const)(v.priority)&&oneOf(["To do","In progress","Done"] as const)(v.status));
 const events=Array.isArray(value.events)&&value.events.every(v=>object(v)&&[v.id,v.title,v.date,v.time,v.relatedTo].every(text)&&number(v.attendees)&&oneOf(["Meeting","Deadline","Call"] as const)(v.category));
 const profile=object(value.profile)&&[value.profile.name,value.profile.role,value.profile.email,value.profile.phone,value.profile.location,value.profile.bio].every(text);
 return contacts&&companies&&deals&&tasks&&events&&profile;
}

export function normalizeCRMRelationships(state:CRMState):CRMState{
 const companyIds=new Map(state.companies.map(company=>[company.name,company.id]));
 const contactIds=new Map(state.contacts.map(contact=>[contact.name,contact.id]));
 return {...state,
  deals:state.deals.map(deal=>({...deal,companyId:deal.companyId??companyIds.get(deal.company),contactId:deal.contactId??contactIds.get(deal.contact)})),
  tasks:state.tasks.map(task=>({...task,relatedToId:task.relatedToId??companyIds.get(task.relatedTo)})),
  events:state.events.map(event=>({...event,relatedToId:event.relatedToId??companyIds.get(event.relatedTo)})),
 };
}
