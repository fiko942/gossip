import Auth from "../../class/Auth";
import { Request, Response } from "express";

export default async function validateSession(
  req: Request,
  res: Response,
  auth: Auth
): Promise<void> {
  try {
    const { hash } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const data = await auth.validateSession(hash, {
      ip: ip as string,
    });
    if (!data) {
      throw new Error("INVALID SESSION");
    }

    res.json({
      error: false,
      data,
      statusCode: 200,
    });
  } catch (err) {
    res.json({
      error: true,
      msg: err?.toString(),
      statusCode: 500,
    });
  }
}
