import { ChatMessage } from "@lunos/client";
import { UserData } from "../interfaces/interface";
import lunos from "../lib/lunos";
import logger from "../lib/logger";

export async function discoverModels() {
  try {
    const models = await lunos.models.getModels();
    return models;
  } catch (error) {
    logger.error("Error discovering models:", error);
    throw error;
  }
}

export async function generateText(prompt: string): Promise<string> {
  try {
    const resp = await lunos.chat.createCompletion({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return resp.choices?.[0].message?.content || "Tidak ada respon";
  } catch (error) {
    logger.error("Error generating text:", error);
    throw error;
  }
}

export async function generateDocs(user: UserData) {
  try {
    const job = user.jobs[0];

    const prompt = `
    Buatlah Surat Lamaran, Ringkasan, dan daftar pengalaman serta keterampilan yang relevan untuk pengguna berikut yang melamar pekerjaan yang ditentukan.

    - Pilih hanya pengalaman dan keterampilan yang paling relevan yang sesuai dengan deskripsi pekerjaan.
    - Tulis ulang deskripsi pengalaman agar lebih profesional, ringkas, dan berorientasi pada pencapaian (misalnya, soroti dampak, metrik, dan tanggung jawab).
    - Pastikan output disesuaikan dengan pekerjaan yang dituju.

    Data Pengguna:
    Nama: ${user.name}
    Email: ${user.email}
    Telepon: ${user.phone}
    Alamat: ${user.address}
    LinkedIn: ${user.linkedin}
    GitHub: ${user.portfolio}
    Pendidikan: ${user.educations
      .map(
        (edu) =>
          `${edu.degree} di bidang ${edu.fieldOfStudy} dari ${edu.institution} (${edu.startDate} - ${edu.endDate})`
      )
      .join(", ")}
    Pengalaman: ${user.experiences
      .map(
        (exp) =>
          `${exp.status} ${exp.title} ${exp.type} di ${exp.company} (${exp.startDate} - ${exp.endDate})
    Deskripsi: ${exp.description}`
      )
      .join("\n")}

    Keterampilan: ${user.skills
      .map((skill) => `${skill.level} ${skill.name}`)
      .join(", ")}
    Data Pekerjaan:
    Judul: ${job.jobTitle}
    Perusahaan: ${job.company}
    Lokasi: ${job.location}
    Deskripsi: ${job.description}
    Kembalikan JSON dengan bidang: 
    - coverLetter
    - summary
    - relevantExperiences (array objek dengan: title, company, startDate, endDate, location, description)
    - relevantSkills (array objek dengan: name, level)
    `;

    const completion = await lunos.chat.createCompletion({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "Anda adalah asisten pembuat dokumen." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    return JSON.parse(text ?? "{}");
  } catch (error) {
    logger.error("Error generating documents:", error);
    throw error;
  }
}

export async function createCompletionJson(
  message: ChatMessage[]
): Promise<any> {
  try {
    const completion = await lunos.chat.createCompletion({
      model: "openai/gpt-4o-mini",
      messages: message,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    return JSON.parse(text ?? "{}");
  } catch (error) {
    logger.error("Error creating completion JSON:", error);
    throw error;
  }
}
