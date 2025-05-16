// src/infrastructure/adapters/express/ExpressAdapter.ts
import { Request, Response } from "express";
import { BaseController } from "@/shared/adapters/BaseController";

export const adaptExpressRoute = (controller: BaseController) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpResponse = await controller.execute({
      body: req.body,
      headers: req.headers,
      params: req.params,
      query: req.query,
    });

    if (!httpResponse) {
      res.status(500).json({ message: "No response returned" });
      return;
    }

    if (httpResponse.body === undefined || httpResponse.body === null) {
      res.sendStatus(httpResponse.statusCode);
      return;
    }

    res.status(httpResponse.statusCode).json(httpResponse.body);
    return;
  };
};
