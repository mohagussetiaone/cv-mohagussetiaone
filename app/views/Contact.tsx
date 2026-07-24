"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Invalid email address."),
  message: z.string().min(6, {
    message: "Message must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

type ContactProps = {
  locale?: string;
};

const Contact = ({ locale: propLocale }: ContactProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("Contact");
  const content = useSiteContent("contact", locale);
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    return get;
  }, [content, locale, t]);

  // Use the useForm hook with the schema
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to send message.");
        return;
      }

      toast.success(json.message || "Message sent successfully!");
      form.reset();
    } catch {
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-20 px-4 md:px-8" id="contact">
      <div className="flex justify-center">
        <div
          className={cn(
            "inline-block border-2 p-2 rounded-tl-xl rounded-br-xl mb-8",
            theme === "neobrutalism" && "border-amber-400",
            theme === "retro" && "border-[#6699ff]",
            theme !== "neobrutalism" && theme !== "retro" && "border-brand-500",
          )}
        >
          <h1 className={cn("text-2xl font-bold px-4", theme === "neobrutalism" && "text-amber-400", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{t2("title")}</h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t2("title_form_1")}</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-white border-white bg-black rounded-lg" placeholder="John Doe" />
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t2("title_form_2")}</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-white border-white bg-black rounded-lg" placeholder="jondoe@example.com" />
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t2("title_form_3")}</FormLabel>
                <FormControl>
                  <Input {...field} type="message" className="text-white border-white bg-black rounded-lg" placeholder="I Think You Can Follow me" />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <div className="flex justify-end py-4 md:py-8">
            <Button
              type="submit"
              size={"lg"}
              className={cn(
                "rounded-xl text-black",
                theme === "neobrutalism" && "bg-amber-400 hover:bg-amber-400/80 border-2 border-black shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5",
                theme === "retro" && "bg-[#6699ff] hover:bg-[#6699ff]/80 text-white",
                theme !== "neobrutalism" && theme !== "retro" && "bg-brand-500 hover:bg-brand-500/60",
              )}
            >
              {t2("submit")}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Contact;
