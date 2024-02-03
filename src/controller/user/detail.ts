import User from "../../class/User";
import { Request, Response } from "express";

export default async function detail(req: Request, res: Response, user: User) {
  try {
    const hash = req.header("X-Token");
    const detail = await user.detail(hash ? hash : "");
    res.json({
      error: false,
      msg: null,
      data: detail,
    });
  } catch (err) {
    res.json({
      error: true,
      msg: err?.toString(),
      statusCode: 200,
    });
  }
}
