import type { CRMState } from "./types";

export const seedState: CRMState = {
  contacts: [
    {id:"c1",name:"John Doe",role:"Product Director",company:"Nova Labs",email:"john@novalabs.demo",phone:"+1 202 555 0142",status:"Active",initials:"JD",tags:["Enterprise"],createdAt:"2026-08-10"},
    {id:"c2",name:"Jane Smith",role:"Operations Lead",company:"Cloudly",email:"jane@cloudly.demo",phone:"+1 202 555 0128",status:"Lead",initials:"JS",tags:["SaaS"],createdAt:"2026-08-12"},
    {id:"c3",name:"Michael Brown",role:"Founder",company:"Vertex Co",email:"michael@vertex.demo",phone:"+1 202 555 0177",status:"Active",initials:"MB",tags:["Priority"],createdAt:"2026-08-14"},
    {id:"c4",name:"Alice Johnson",role:"Marketing VP",company:"Pixel Works",email:"alice@pixelworks.demo",phone:"+1 202 555 0193",status:"Inactive",initials:"AJ",tags:["Agency"],createdAt:"2026-08-16"},
    {id:"c5",name:"Robert Lee",role:"CTO",company:"Metric AI",email:"robert@metric.demo",phone:"+1 202 555 0110",status:"Lead",initials:"RL",tags:["AI"],createdAt:"2026-08-18"},
  ],
  companies: [
    {id:"co1",name:"Nova Labs",industry:"Technology",website:"novalabs.demo",location:"San Francisco, US",value:85200,contactCount:8,status:"Customer"},
    {id:"co2",name:"Cloudly",industry:"SaaS",website:"cloudly.demo",location:"Austin, US",value:46900,contactCount:5,status:"Prospect"},
    {id:"co3",name:"Vertex Co",industry:"Finance",website:"vertex.demo",location:"London, UK",value:123500,contactCount:12,status:"Customer"},
    {id:"co4",name:"Pixel Works",industry:"Agency",website:"pixelworks.demo",location:"Berlin, DE",value:31800,contactCount:4,status:"Prospect"},
  ],
  deals: [
    {id:"d1",title:"Enterprise workspace",company:"Nova Labs",companyId:"co1",contact:"John Doe",contactId:"c1",value:18500,stage:"Won",probability:100,owner:"Aarthi",closeDate:"2026-08-28"},
    {id:"d2",title:"Cloud migration",company:"Cloudly",companyId:"co2",contact:"Jane Smith",contactId:"c2",value:12990,stage:"Negotiation",probability:75,owner:"Aarthi",closeDate:"2026-09-04"},
    {id:"d3",title:"Analytics rollout",company:"Vertex Co",companyId:"co3",contact:"Michael Brown",contactId:"c3",value:9500,stage:"Proposal",probability:55,owner:"Aarthi",closeDate:"2026-09-10"},
    {id:"d4",title:"Brand platform",company:"Pixel Works",companyId:"co4",contact:"Alice Johnson",contactId:"c4",value:6230,stage:"Qualified",probability:35,owner:"Aarthi",closeDate:"2026-09-18"},
    {id:"d5",title:"AI support suite",company:"Metric AI",contact:"Robert Lee",contactId:"c5",value:15200,stage:"Lead",probability:15,owner:"Aarthi",closeDate:"2026-09-25"},
  ],
  tasks: [
    {id:"t1",title:"Prepare Nova proposal",description:"Finalize pricing and rollout milestones.",priority:"High",status:"In progress",dueDate:"2026-08-26",relatedTo:"Nova Labs",relatedToId:"co1"},
    {id:"t2",title:"Follow up with Cloudly",description:"Share security questionnaire answers.",priority:"Medium",status:"To do",dueDate:"2026-08-28",relatedTo:"Cloudly",relatedToId:"co2"},
    {id:"t3",title:"Update pipeline forecast",description:"Recheck probabilities for Q3 deals.",priority:"Low",status:"Done",dueDate:"2026-08-24",relatedTo:"Sales pipeline"},
  ],
  events: [
    {id:"e1",title:"Customer review",date:"2026-08-26",time:"10:00",category:"Meeting",attendees:6,relatedTo:"Nova Labs",relatedToId:"co1"},
    {id:"e2",title:"Cloudly discovery call",date:"2026-08-28",time:"14:30",category:"Call",attendees:3,relatedTo:"Cloudly",relatedToId:"co2"},
    {id:"e3",title:"Proposal deadline",date:"2026-09-10",time:"17:00",category:"Deadline",attendees:2,relatedTo:"Vertex Co",relatedToId:"co3"},
  ],
  profile: {name:"Aarthi Raman",role:"CRM Product Specialist",email:"aarthi@example.demo",phone:"+91 98765 43210",location:"Chennai, India",bio:"I design thoughtful CRM experiences that turn customer signals into clear actions."}
};
