import { Request, Response } from "express";
import Auth from "../../class/Auth";

export default async function google(req: Request, res: Response, auth: Auth) {
  try {
    res.redirect(auth.Google());
  } catch (err) {
    res.json({
      error: true,
      msg: err?.toString(),
    });
  }
}
