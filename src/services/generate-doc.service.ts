import ejs from "ejs";
import puppeteer from "puppeteer";
import { Response } from "express";
import { UserData, UserGeneratedData } from "../interfaces/interface";
import path from "path";
import prisma from "../lib/prisma";
import { generateDocs } from "./lunos.service";
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
      const html = await ejs.renderFile(
        path.join(__dirname, "..", "views", "cv.ejs"),
        { user: userData, summary }
      );

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cv-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating CV:", error);
    }
  }

  async generateCoverLetter(
    userData: UserData,
    coverLetter: string | null,
    res: Response
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
      const pdf = await page.pdf({ format: "A4" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=cover-letter-${userData.id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating cover letter:", error);
    }
  }
}
