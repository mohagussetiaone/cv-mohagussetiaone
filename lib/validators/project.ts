import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine((value) => value === null || /^https?:\/\//i.test(value), {
    message: "URL harus diawali http:// atau https://",
  });

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

const csvToArray = z
  .string()
  .trim()
  .transform((value) =>
    Array.from(
      new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    )
  );

export const projectPayloadSchema = z.object({
  productId: z.coerce.number().int().nonnegative().optional(),
  image: optionalString,
  urlPreview: optionalUrl,
  githubUrl: optionalUrl,
  figmaUrl: optionalUrl,
  internal: z.coerce.boolean().default(false),
  technologies: csvToArray.refine((value) => value.length > 0, {
    message: "Minimal satu teknologi harus diisi",
  }),
  categories: csvToArray.refine((value) => value.length > 0, {
    message: "Minimal satu kategori harus diisi",
  }),
  translations: z.object({
    id: z.object({
      projectName: z.string().trim().min(2, "Nama project Indonesia minimal 2 karakter"),
      description: z.string().trim().min(10, "Deskripsi Indonesia minimal 10 karakter"),
    }),
    en: z.object({
      projectName: z.string().trim().min(2, "Nama project English minimal 2 karakter"),
      description: z.string().trim().min(10, "Deskripsi English minimal 10 karakter"),
    }),
  }),
});

export type ProjectPayload = z.infer<typeof projectPayloadSchema>;
