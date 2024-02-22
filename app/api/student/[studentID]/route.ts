import { NextResponse } from "next/server";

export async function GET(req: Request,context:any) {
const {params} = context;
console.log(params)

return NextResponse.json({
    params
})

}