export default function handler(_req:any,res:any){res.status(200).json({ok:true,name:process.env.NEXT_PUBLIC_APP_NAME||'DealSync'})}
