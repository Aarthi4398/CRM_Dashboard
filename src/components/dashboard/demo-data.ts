export type Period = "Monthly" | "Quarterly" | "Annually";
export type OrderStatus = "Complete" | "Pending" | "Cancel";
export type DashboardOrder = {
  id: string;
  initials: string;
  customer: string;
  email: string;
  service: string;
  value: string;
  closeDate: string;
  status: OrderStatus;
};

export const recentOrders: DashboardOrder[] = [
  {id:"DE124321",initials:"JD",customer:"John Doe",email:"johndoe@gmail.com",service:"Software License",value:"$18,50.34",closeDate:"2024-06-15",status:"Complete"},
  {id:"DE124322",initials:"JS",customer:"Jane Smith",email:"janesmith@gmail.com",service:"Cloud Hosting",value:"$12,99.00",closeDate:"2024-06-18",status:"Pending"},
  {id:"DE124323",initials:"MB",customer:"Michael Brown",email:"michaelbrown@gmail.com",service:"Web Domain",value:"$9,50.00",closeDate:"2024-06-20",status:"Cancel"},
  {id:"DE124324",initials:"AJ",customer:"Alice Johnson",email:"alicejohnson@gmail.com",service:"SSL Certificate",value:"$2,30.45",closeDate:"2024-06-25",status:"Pending"},
  {id:"DE124325",initials:"RL",customer:"Robert Lee",email:"robertlee@gmail.com",service:"Premium Support",value:"$15,20.00",closeDate:"2024-06-30",status:"Complete"},
];

export const statisticsData = [
 {month:"Jan",income:180,expenses:40},{month:"Feb",income:190,expenses:30},{month:"Mar",income:170,expenses:48},{month:"Apr",income:160,expenses:38},
 {month:"May",income:175,expenses:52},{month:"Jun",income:165,expenses:40},{month:"Jul",income:172,expenses:70},{month:"Aug",income:205,expenses:100},
 {month:"Sep",income:228,expenses:110},{month:"Oct",income:208,expenses:120},{month:"Nov",income:239,expenses:148},{month:"Dec",income:235,expenses:140},
];

export const salesCategories = [
 {name:"Affiliate Program",value:48,products:"2,040 Products",color:"#465fff"},
 {name:"Direct Buy",value:33,products:"1,402 Products",color:"#7592ff"},
 {name:"Adsense",value:19,products:"510 Products",color:"#c7d7fe"},
];
