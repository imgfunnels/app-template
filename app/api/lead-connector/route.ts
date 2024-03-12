import prisma from "@/helpers/Prisma/db";
import { GHL } from "@/helpers/HighLevel/index";
import { logger } from "@/helpers/Logger/winston";
const ghl = new GHL();

export async function POST(request: Request, res: Response) {
  logger.info("LEAD-CONNECTOR");
  const body = await request.json();
  const { key } = body;
  try {
    const ssoObject = await ghl.decryptSSOData(key);

    logger.info("SSO", {
      ssoObject,
      NEXT_PUBLIC_HIGHLEVEL_CLIENT_ID:
        process.env.NEXT_PUBLIC_HIGHLEVEL_CLIENT_ID,
      planId: ssoObject.planId
    });

    let user = await prisma.user.findFirst({
      where: { email: ssoObject.email }
    });

    const data = { success: true, ssoObject, user };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json"
      }
    });
  } catch (error: any) {
    logger.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
}
