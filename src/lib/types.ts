export type ContactStatus = "Active" | "Lead" | "Inactive";
export type DealStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export type TaskStatus = "To do" | "In progress" | "Done";

export interface Contact { id:string; name:string; role:string; company:string; email:string; phone:string; status:ContactStatus; initials:string; tags:string[]; createdAt:string }
export interface Company { id:string; name:string; industry:string; website:string; location:string; value:number; contactCount:number; status:"Customer"|"Prospect" }
export interface Deal { id:string; title:string; company:string; contact:string; value:number; stage:DealStage; probability:number; owner:string; closeDate:string }
export interface CRMTask { id:string; title:string; description:string; priority:"Low"|"Medium"|"High"; status:TaskStatus; dueDate:string; relatedTo:string }
export interface CalendarEvent { id:string; title:string; date:string; time:string; category:"Meeting"|"Deadline"|"Call"; attendees:number; relatedTo:string }
export interface Profile { name:string; role:string; email:string; phone:string; location:string; bio:string }
export interface CRMState { contacts:Contact[]; companies:Company[]; deals:Deal[]; tasks:CRMTask[]; events:CalendarEvent[]; profile:Profile }
