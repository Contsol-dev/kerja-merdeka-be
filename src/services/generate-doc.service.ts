import ejs from "ejs";
import puppeteer from "puppeteer";
import { Response } from "express";
import { UserData } from "../interfaces/interface";
import path from "path";
import prisma from "../lib/prisma";
import { generateDocs } from "./lunos.service";
import { makeCacheKey, pdfCache } from "../lib/pdfCache";
export class GenerateDocService {
  async generate(userData: UserData) {
    try {
      if (!userData.jobs.length) throw new Error("Job data not found");

      const jobDataId = userData.jobs[0].id;

      const existingResult = await prisma.generatedResult.findUnique({
        where: { jobDataId },
      });

      if (existingResult) {
        return existingResult;
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
      throw new Error("Failed to generate document: " + error.message);
    }
  }

  async generateCv(userData: UserData, summary: string | null, res: Response) {
    try {
      const cacheKey = makeCacheKey(userData.id, userData.jobs[0].id, "cv");

      if (pdfCache.has(cacheKey)) {
        const pdf = pdfCache.get(cacheKey);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=cv-${userData.id}.pdf`
        );
        return res.send(pdf);
      }

      const html = await ejs.renderFile(
        path.join(__dirname, "..", "views", "cv.ejs"),
        { user: userData, summary }
      );

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();

      pdfCache.set(cacheKey, pdf);
      setTimeout(() => pdfCache.delete(cacheKey), 60 * 60 * 1000);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cv-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating CV:", error);
      res.status(500).send("Failed to generate CV.");
    }
  }

  async generateCoverLetter(
    userData: UserData,
    coverLetter: string | null,
    res: Response
  ) {
    try {
      const cacheKey = makeCacheKey(
        userData.id,
        userData.jobs[0].id,
        "coverLetter"
      );

      if (pdfCache.has(cacheKey)) {
        const pdf = pdfCache.get(cacheKey);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=cover-letter-${userData.id}.pdf`
        );
        return res.send(pdf);
      }

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
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();

      pdfCache.set(cacheKey, pdf);
      setTimeout(() => pdfCache.delete(cacheKey), 60 * 60 * 1000);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cover-letter-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  }
}
