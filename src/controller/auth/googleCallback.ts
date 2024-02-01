import Auth from "../../class/Auth";
import { Request, Response } from "express";
import config from "../../config";

export default async function googleCallback(
  req: Request,
  res: Response,
  auth: Auth
): Promise<void> {
  try {
    const { code } = req.query;
    if (typeof code !== "string") {
      throw new Error("Invalid params");
    }

    const sessionHash = await auth.googleCallback(code, req);
    res.redirect(`${config.frontendHomeUrl}/?session=${sessionHash}`);
  } catch (err) {
    res.json({
      error: true,
      msg: err?.toString(),
      statusCode: 500,
    });
  }
}
