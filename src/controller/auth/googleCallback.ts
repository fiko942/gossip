import Auth from "../../class/Auth";
import { Request, Response } from "express";

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

    await auth.googleCallback(code);
    res.sendStatus(200);
    // res.redirect(`/?code=${code}`);
  } catch (err) {
    res.json({
      error: true,
      msg: err?.toString(),
      statusCode: 500,
    });
  }
}
