import ejs from "ejs";
import puppeteer from "puppeteer";
import { Response } from "express";
import { UserData } from "../interfaces/interface";
import path from "path";
import prisma from "../lib/prisma";
import { generateDocs } from "./lunos.service";
import { makeCacheKey, pdfCache } from "../lib/pdfCache";
import { ApiError } from "../middlewares/error-handler.middleware";
import logger from "../lib/logger";
export class GenerateDocService {
  async generate(userData: UserData, update: boolean = false) {
    try {
      if (!userData.jobs.length) throw new ApiError(400, "Job data not found");

      const jobDataId = userData.jobs[0].id;

      const existingResult = await prisma.generatedResult.findUnique({
        where: { jobDataId },
      });

      if (existingResult && !update) {
        return existingResult;
      } else {
        await prisma.generatedResult.deleteMany({
          where: { jobDataId },
        });
      }

      const { cvText, coverLetter, summary } = await generateDocs(userData);

      const result = await prisma.generatedResult.create({
        data: {
          cvText,
          coverLetter,
          summary,
          jobDataId,
        },
      });

      return result;
    } catch (error: any) {
      logger.error(`Document generation error: ${error.message}`);
      throw error;
    }
  }

  async renderCvBuffer(userData: UserData, summary: string | null) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "..", "views", "cv.ejs"),
        { user: userData, summary }
      );

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      return pdfBuffer;
    } catch (error: any) {
      logger.error(`CV buffer rendering error: ${error.message}`);
      throw error;
    }
  }

  async generateCv(
    userData: UserData,
    summary: string | null,
    res: Response,
    update: boolean = false
  ) {
    try {
      const cacheKey = makeCacheKey(userData.id, userData.jobs[0].id, "cv");

      if (pdfCache.has(cacheKey) && !update) {
        const pdf = pdfCache.get(cacheKey);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=cv-${userData.id}.pdf`
        );
        return res.send(pdf);
      } else {
        pdfCache.delete(cacheKey);
      }

      const pdf = await this.renderCvBuffer(userData, summary);

      pdfCache.set(cacheKey, pdf);
      setTimeout(() => pdfCache.delete(cacheKey), 60 * 60 * 1000);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cv-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      logger.error("Error generating CV:", error);
      throw error;
    }
  }

  async renderCoverLetterBuffer(
    userData: UserData,
    coverLetter: string | null
  ) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "..", "views", "cover-letter.ejs"),
        {
          name: userData.name,
          coverLetter,
          email: userData.email,
        }
      );

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      return pdfBuffer;
    } catch (error: any) {
      logger.error(`Cover Letter buffer rendering error: ${error.message}`);
      throw error;
    }
  }

  async generateCoverLetter(
    userData: UserData,
    coverLetter: string | null,
    res: Response,
    update: boolean = false
  ) {
    try {
      const cacheKey = makeCacheKey(
        userData.id,
        userData.jobs[0].id,
        "coverLetter"
      );

      if (pdfCache.has(cacheKey) && !update) {
        const pdf = pdfCache.get(cacheKey);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=cover-letter-${userData.id}.pdf`
        );
        return res.send(pdf);
      } else {
        pdfCache.delete(cacheKey);
      }

      const pdf = await this.renderCoverLetterBuffer(userData, coverLetter);

      pdfCache.set(cacheKey, pdf);
      setTimeout(() => pdfCache.delete(cacheKey), 60 * 60 * 1000);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cover-letter-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      logger.error("Error generating cover letter:", error);
      throw error;
    }
  }
}
