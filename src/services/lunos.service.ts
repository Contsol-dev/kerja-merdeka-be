import { ChatMessage, LunosClient } from "@lunos/client";
import { UserData } from "../interfaces/interface";
import lunos from "../lib/lunos";

export async function discoverModels() {
  const models = await lunos.models.getModels();
  return models;
}

export async function generateText(prompt: string): Promise<string> {
  const resp = await lunos.chat.createCompletion({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return resp.choices?.[0].message?.content || "No output";
}

export async function generateDocs(user: UserData) {
  const job = user.jobs[0];

  const prompt = `
  Generate a CV, Cover Letter, and a Summary for the following user applying to the specified job:
  User Data:
  Name: ${user.name}
  Email: ${user.email}
  Phone: ${user.phone}
  Address: ${user.address}
  LinkedIn: ${user.linkedin}
  GitHub: ${user.portfolio}
  Education: ${user.educations
    .map(
      (edu) =>
        `${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`
    )
    .join(", ")}
  Experience: ${user.experiences
    .map(
      (exp) =>
        `${exp.status} ${exp.title} ${exp.type} at ${exp.company} (${exp.startDate} - ${exp.endDate})`
    )
    .join(", ")}
  Skills: ${user.skills
    .map((skill) => `${skill.level} ${skill.name}`)
    .join(", ")}

  Job Data:
  Title: ${job.jobTitle}
  Company: ${job.company}
  Location: ${job.location}
  Description: ${job.description}
  
  Return JSON with fields: cvText, coverLetter, summary
  `;

  const completion = await lunos.chat.createCompletion({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a document generator assistant." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0].message.content;
  return JSON.parse(text ?? "{}");
}

export async function createCompletionJson(
  message: ChatMessage[]
): Promise<any> {
  const completion = await lunos.chat.createCompletion({
    model: "openai/gpt-4o-mini",
    messages: message,
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0].message.content;
  return JSON.parse(text ?? "{}");
}
