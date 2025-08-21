import PDFDocument from "pdfkit";
import { Response } from "express";
import { UserData, UserGeneratedData } from "../interfaces/interface";
import { formatEnumText } from "../utils/utils";

export class PdfService {
  generateCV(userData: UserGeneratedData, res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
    doc.pipe(res);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(userData.name, { align: "left" });
    doc.moveDown(0.5);

    const summary = userData.jobs[0].results?.summary;

    if (summary) doc.fontSize(11).font("Helvetica").text(`${summary}`);
    doc.moveDown(0.5);

    if (userData.address) doc.fontSize(11).text(`${userData.address}`);
    doc.moveDown(0.5);
    doc.fontSize(11).text(
      [
        userData.phone ? `Phone: ${userData.phone}` : "",
        userData.linkedin ? `LinkedIn: ${userData.linkedin}` : "",
        userData.github ? `GitHub: ${userData.github}` : "",
        userData.email ? `Email: ${userData.email}` : "",
      ]
        .filter((item) => item) // Remove empty strings
        .join(" | ")
    );
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("EDUCATION", { align: "center" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    userData.educations.forEach((edu) => {
      doc
        .fontSize(11)
        .table()
        .row([
          {
            text: edu.institution,
            align: { x: "left", y: "center" },
            font: "Helvetica-Bold",
            border: false,
          },
          {
            text: `${edu.startDate.getFullYear()} - ${edu.endDate.getFullYear()}`,
            align: { x: "right", y: "center" },
            font: "Helvetica-Bold",
            border: false,
          },
        ])
        .row([
          {
            text: `${edu.degree} - ${edu.fieldOfStudy}`,
            align: { x: "left", y: "center" },
            font: "Helvetica",
            border: false,
          },
        ])
        .end();
      doc.moveDown(0.5);
    });
    doc.moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("EXPERIENCE", { align: "center" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    userData.experiences.forEach((exp) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .table()
        .row([
          {
            text: exp.company,
            align: { x: "left", y: "center" },
            font: "Helvetica-Bold",
            border: false,
          },
          {
            text: `${exp.startDate.getFullYear()} - ${exp.endDate.getFullYear()}`,
            align: { x: "right", y: "center" },
            font: "Helvetica-Bold",
            border: false,
          },
        ])
        .row([
          {
            text: `${formatEnumText(exp.status)} ${exp.title} ${formatEnumText(
              exp.type
            )}`,
            align: { x: "left", y: "center" },
            font: "Helvetica",
            border: false,
          },
        ])
        .end();
      doc.fontSize(11).font("Helvetica").text(`${exp.description}`);
      doc.moveDown(0.5);
    });

    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(14).font("Helvetica-Bold").text("SKILLS", { align: "center" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(userData.skills.map((s) => s.name).join(", "));
    doc.moveDown();

    doc.end();
  }

  generateCoverLetter(userData: UserGeneratedData, res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    // ACTIVATE TO DOWNLOAD FILE
    /* res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${userData.name}-CoverLetter.pdf`
    );
    doc.pipe(res); */

    // PREVIEW ONLY
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Cover Letter", { align: "center" });
    doc.moveDown();

    const coverLetter = userData.jobs[0].results?.coverLetter;
    if (coverLetter) {
      doc.fontSize(12).text(coverLetter);
    } else {
      doc.fontSize(12).text(`Dear Hiring Manager,`);
      doc.moveDown();

      doc.text(
        `I am writing to express my interest in the position of ${
          userData.jobs[0]?.jobTitle
        }. With my background in ${
          userData.experiences[0]?.title
        } and skills in ${userData.skills
          .map((s) => s.name)
          .join(", ")}, I believe I am a strong candidate for this role.`
      );
    }

    doc.moveDown();

    doc.text("Thank you for your time and consideration.");
    doc.moveDown();

    doc.text(`Sincerely,\n${userData.name}`);

    doc.end();
  }
}
