
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/types";
import { Logo } from "@/components/icons/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['employee', 'manager'], { required_error: "Please select a role." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const registrationFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  registrationType: z.enum(['join', 'create'], { required_error: "Please select an option." }),
  cafeInviteCode: z.string().optional(),
  newCafeName: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
}).refine(data => {
  if (data.registrationType === 'join') {
    return !!data.cafeInviteCode && data.cafeInviteCode.length > 0;
  }
  return true;
}, {
  message: "Cafe invite code is required to join an existing cafe.",
  path: ["cafeInviteCode"],
}).refine(data => {
  if (data.registrationType === 'create') {
    return !!data.newCafeName && data.newCafeName.length > 0;
  }
  return true;
}, {
  message: "Cafe name is required to create a new cafe.",
  path: ["newCafeName"],
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const MOCK_INVITE_CODE = "CAFE123"; // Example invite code

export function LoginForm() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "employee",
    },
  });

  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      registrationType: "join",
      cafeInviteCode: "",
      newCafeName: "",
    },
  });

  const registrationType = registrationForm.watch("registrationType");

  function onLoginSubmit(data: LoginFormValues) {
    login(data.email, data.role as UserRole);
  }

  async function onRegistrationSubmit(data: RegistrationFormValues) {
    let role: UserRole = 'employee';
    let cafeName = data.newCafeName;

    if (data.registrationType === 'create') {
      role = 'manager';
      if (!data.newCafeName) { // Should be caught by Zod, but good to double check
        toast({ title: "Error", description: "Cafe name is required.", variant: "destructive" });
        return;
      }
    } else { // Join
      if (data.cafeInviteCode !== MOCK_INVITE_CODE) {
        registrationForm.setError("cafeInviteCode", { type: "manual", message: "Invalid invite code." });
        toast({ title: "Registration Failed", description: "Invalid invite code.", variant: "destructive"});
        return;
      }
      // For joining, cafeName might come from backend based on code. For mock, it's not set.
      cafeName = "the Cafe"; // Placeholder name for joined cafe
    }
    
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    register(data.fullName, data.email, role, cafeName);
    toast({
      title: "Registration Successful!",
      description: `Welcome, ${data.fullName}! You can now sign in.`,
    });
     // Potentially switch to login tab or redirect, for now just clear form
    registrationForm.reset();
  }
  
  if (!isClient) {
    // Render a skeleton or null during SSR to avoid hydration mismatches with Tabs
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo size={48} />
            </div>
            <CardTitle className="text-3xl font-bold">Loading...</CardTitle>
            <CardDescription>Please wait while we prepare the page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-12 bg-muted rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo size={48} />
          </div>
          <CardTitle className="text-3xl font-bold">CafeTime Portal</CardTitle>
          <CardDescription>Manage your shifts and availability with ease.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 pt-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registrationForm}>
                <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-6 pt-6">
                  <FormField
                    control={registrationForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registrationForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registrationForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registrationForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registrationForm.control}
                    name="registrationType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>How would you like to register?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="join" />
                              </FormControl>
                              <FormLabel className="font-normal">Join an Existing Cafe</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="create" />
                              </FormControl>
                              <FormLabel className="font-normal">Create a New Cafe</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {registrationType === "join" && (
                    <FormField
                      control={registrationForm.control}
                      name="cafeInviteCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cafe Invite Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter invite code" {...field} />
                          </FormControl>
                          <FormDescription>Ask your manager for the cafe's invite code.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {registrationType === "create" && (
                    <FormField
                      control={registrationForm.control}
                      name="newCafeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Cafe Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., The Daily Grind" {...field} />
                          </FormControl>
                          <FormDescription>You'll be the manager of this new cafe.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90" disabled={registrationForm.formState.isSubmitting}>
                    {registrationForm.formState.isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    