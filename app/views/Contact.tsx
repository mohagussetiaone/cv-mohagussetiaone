"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

const Contact = () => {
  // Use the useForm hook with the schema
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("data terinput:", data);
  };

  return (
    <div className="py-10 md:py-20 px-4 md:px-20" id="contact">
      <div className="flex justify-start">
        <div className="inline-block border-2 border-brand-500 p-2 rounded-tl-xl rounded-br-xl mb-8">
          <h1 className="text-2xl font-bold text-brand-500 px-4">Send Me A Message</h1>
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
                  <FormLabel className="text-white">Your Name</FormLabel>
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
                  <FormLabel className="text-white">Email</FormLabel>
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
                <FormLabel className="text-white">Your Message</FormLabel>
                <FormControl>
                  <Input {...field} type="message" className="text-white border-white bg-black rounded-lg" placeholder="I Think You Can Follow me" />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <div className="flex justify-end py-4 md:py-8">
            <Button type="submit" size={"lg"} className="bg-brand-500 hover:bg-brand-500/60 rounded-xl text-black">
              Submit
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Contact;
