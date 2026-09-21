import { Request, Response } from "express";
import { FastLEDCheckerEngine } from "../lib/fastled_engine.js";
import { prisma } from "../lib/prisma.js";

export const calculateMaxBid = (req: Request, res: Response): void => {
  const result = FastLEDCheckerEngine.calculateMaxBid(req.body);
  res.json({ success: true, data: result });
};

export const calculateWoodValuation = (req: Request, res: Response): void => {
  const result = FastLEDCheckerEngine.calculateWoodValuation(req.body);
  res.json({ success: true, data: result });
};

export const getContractors = async (req: Request, res: Response): Promise<void> => {
  try {
    const contractors = await prisma.contractor.findMany({
      orderBy: { rating: "desc" }
    });
    res.json({ success: true, total: contractors.length, data: contractors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
