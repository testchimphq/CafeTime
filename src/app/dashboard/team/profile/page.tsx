"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MOCK_DETAILED_EMPLOYEES } from '@/lib/mock-data';
import type { User, Certification, WageHistoryEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Briefcase, GraduationCap, DollarSign, Phone, Mail, CalendarDays, PlusCircle, Trash2, GripVertical, Save } from 'lucide-react';
import { Routes } from '@/lib/constants';
import { format, parseISO } from 'date-fns';

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required."),
  issuingOrg: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

const wageHistorySchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, "Date is required."),
  newWage: z.number().optional(),
  newTitle: z.string().optional(),
  notes: z.string().optional(),
});

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  startDate: z.string().optional(),
  currentWage: z.number().optional(),
  skills: z.array(z.string()).optional(), // For simplicity, skills are managed as an array of strings
  certifications: z.array(certificationSchema).optional(),
  wageHistory: z.array(wageHistorySchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Helper to format date string for display (e.g., from ISO to "MMMM d, yyyy")
const formatDateForDisplay = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

// Helper to format date string for input type="date" (YYYY-MM-DD)
const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch (error) {
    // If it's already in yyyy-MM-dd or some other format, try to return it as is or empty
    if (/\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;
    return '';
  }
};


function EmployeeProfileContent() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const employeeId = searchParams.get('id');

  const [employee, setEmployee] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      startDate: '',
      currentWage: 0,
      skills: [],
      certifications: [],
      wageHistory: [],
    },
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const { fields: wageFields, append: appendWage, remove: removeWage } = useFieldArray({
    control: form.control,
    name: "wageHistory",
  });
  
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (employeeId) {
      const foundEmployee = MOCK_DETAILED_EMPLOYEES.find(emp => emp.id === employeeId);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        form.reset({
          name: foundEmployee.name || '',
          email: foundEmployee.email || '',
          phoneNumber: foundEmployee.phoneNumber || '',
          startDate: foundEmployee.startDate ? formatDateForInput(foundEmployee.startDate) : '',
          currentWage: foundEmployee.currentWage || 0,
          skills: foundEmployee.skills || [],
          certifications: foundEmployee.certifications?.map(c => ({ ...c, issueDate: c.issueDate ? formatDateForInput(c.issueDate) : '', expiryDate: c.expiryDate ? formatDateForInput(c.expiryDate) : ''})) || [],
          wageHistory: foundEmployee.wageHistory?.map(wh => ({ ...wh, date: wh.date ? formatDateForInput(wh.date) : '' })) || [],
        });
        setCurrentSkills(foundEmployee.skills || []);
      } else {
        // Employee not found, redirect or show error
        toast({ title: "Error", description: "Employee not found.", variant: "destructive" });
        router.push(Routes.TEAM);
      }
      setIsLoading(false);
    } else {
        // Handle missing ID
         setIsLoading(false);
    }
  }, [employeeId, form, router, toast]);

  const canEdit = currentUser?.role === 'manager';
  const isOwnProfile = currentUser?.id === employeeId;

  const onSubmit = (data: ProfileFormValues) => {
    if (!canEdit) return;
    
    // Simulate saving data
    console.log("Saving profile data:", {
        ...data,
        skills: currentSkills, // use currentSkills from state for saving
        // Convert dates back to ISO strings or appropriate format for backend
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        certifications: data.certifications?.map(c => ({
            ...c,
            issueDate: c.issueDate ? new Date(c.issueDate).toISOString() : undefined,
            expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString() : undefined,
        })),
        wageHistory: data.wageHistory?.map(wh => ({
            ...wh,
            date: wh.date ? new Date(wh.date).toISOString() : undefined,
            }))
    });
    toast({
      title: "Profile Updated",
      description: `${data.name}'s profile has been (simulated) saved.`,
    });
    setIsEditing(false); 
    // In a real app, you would update MOCK_DETAILED_EMPLOYEES or send to backend
    // and potentially re-fetch or update local state `employee`
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
  };


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><p>Loading profile...</p></div>;
  }

  if (!employeeId) {
      return <div className="flex h-screen items-center justify-center"><p>No employee selected.</p></div>;
  }

  if (!employee) {
    return <div className="flex h-screen items-center justify-center"><p>Employee not found.</p></div>;
  }
  
  const effectiveIsEditing = canEdit && isEditing;


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-2xl">
              <UserIcon className="mr-2 h-6 w-6 text-primary" />
              {employee.name}'s Profile
            </CardTitle>
            <CardDescription>
              {canEdit ? "View and edit employee details." : "View employee details."}
              {isOwnProfile && !canEdit && " (This is your profile. Contact a manager to update.)"}
            </CardDescription>
          </div>
          {canEdit && (
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "outline"}>
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          )}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Section 1: Basic Info & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 flex flex-col items-center space-y-3">
                  <Avatar className="h-32 w-32 border-2 border-primary">
                    <AvatarImage src={employee.avatarUrl || `https://placehold.co/128x128.png?text=${employee.name.charAt(0)}`} alt={employee.name} aria-label={`Avatar of ${employee.name}`} data-ai-hint="profile avatar" />
                    <AvatarFallback className="text-4xl">{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                   {effectiveIsEditing && <Button type="button" variant="outline" size="sm">Change Avatar (mock)</Button>}
                </div>
                <div className="md:col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} readOnly={!effectiveIsEditing} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email</FormLabel>
                        <FormControl><Input type="email" {...field} readOnly={!effectiveIsEditing && !isOwnProfile} /></FormControl> {/* Email might be editable by manager for corrections */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>Phone Number</FormLabel>
                        <FormControl><Input {...field} readOnly={!effectiveIsEditing} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Employment Details */}
              <CardSection title="Employment Details" icon={Briefcase}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Start Date</FormLabel>
                        <FormControl><Input type="date" {...field} readOnly={!effectiveIsEditing} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="currentWage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground"/>Current Hourly Wage</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} readOnly={!effectiveIsEditing} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardSection>

              {/* Section 3: Skills */}
              <CardSection title="Skills" icon={GraduationCap}>
                 {effectiveIsEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          value={skillInput} 
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill"
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}
                        />
                        <Button type="button" onClick={handleAddSkill}><PlusCircle className="h-4 w-4 mr-2"/>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentSkills.map(skill => (
                          <span key={skill} className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                            {skill}
                            <Button type="button" variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveSkill(skill)}>
                              <Trash2 className="h-3 w-3"/>
                            </Button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>{employee.skills?.join(', ') || 'No skills listed.'}</p>
                  )}
              </CardSection>

              {/* Section 4: Certifications */}
              <CardSection title="Certifications" icon={GraduationCap}>
                {certFields.map((field, index) => (
                  <div key={field.id} className="p-3 border rounded-md mb-3 space-y-2 relative">
                     {effectiveIsEditing && (
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive hover:bg-destructive/10" onClick={() => removeCert(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    <FormField control={form.control} name={`certifications.${index}.name`} render={({ field: f }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                       <FormField control={form.control} name={`certifications.${index}.issuingOrg`} render={({ field: f }) => (
                        <FormItem><FormLabel>Issuing Org.</FormLabel><FormControl><Input {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                      )}/>
                      <FormField control={form.control} name={`certifications.${index}.issueDate`} render={({ field: f }) => (
                        <FormItem><FormLabel>Issue Date</FormLabel><FormControl><Input type="date" {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                      )}/>
                      <FormField control={form.control} name={`certifications.${index}.expiryDate`} render={({ field: f }) => (
                        <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                      )}/>
                    </div>
                  </div>
                ))}
                {effectiveIsEditing && (
                  <Button type="button" variant="outline" size="sm" onClick={() => appendCert({ name: '', issuingOrg: '', issueDate: '', expiryDate: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Certification
                  </Button>
                )}
                 {!effectiveIsEditing && employee.certifications?.length === 0 && <p>No certifications listed.</p>}
                 {!effectiveIsEditing && employee.certifications && employee.certifications.length > 0 && !certFields.length && (
                    <ul className="list-disc pl-5 space-y-1">
                        {employee.certifications.map(cert => (
                            <li key={cert.id}>
                                {cert.name} ({cert.issuingOrg || 'N/A'})
                                <span className="text-xs text-muted-foreground">
                                    {cert.issueDate && ` Issued: ${formatDateForDisplay(cert.issueDate)}`}
                                    {cert.expiryDate && ` - Expires: ${formatDateForDisplay(cert.expiryDate)}`}
                                </span>
                            </li>
                        ))}
                    </ul>
                 )}
              </CardSection>

              {/* Section 5: Wage History */}
              <CardSection title="Wage & Role History" icon={Briefcase}>
                 {wageFields.map((field, index) => (
                  <div key={field.id} className="p-3 border rounded-md mb-3 space-y-2 relative">
                      {effectiveIsEditing && (
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive hover:bg-destructive/10" onClick={() => removeWage(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                       <FormField control={form.control} name={`wageHistory.${index}.date`} render={({ field: f }) => (
                        <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                      )}/>
                      <FormField control={form.control} name={`wageHistory.${index}.newTitle`} render={({ field: f }) => (
                        <FormItem><FormLabel>Title/Role</FormLabel><FormControl><Input {...f} readOnly={!effectiveIsEditing}/></FormControl><FormMessage/></FormItem>
                      )}/>
                       <FormField control={form.control} name={`wageHistory.${index}.newWage`} render={({ field: f }) => (
                        <FormItem><FormLabel>Hourly Wage</FormLabel><FormControl><Input type="number" step="0.01" {...f} readOnly={!effectiveIsEditing} onChange={e => f.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage/></FormItem>
                      )}/>
                    </div>
                    <FormField control={form.control} name={`wageHistory.${index}.notes`} render={({ field: f }) => (
                      <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...f} readOnly={!effectiveIsEditing} rows={2}/></FormControl><FormMessage/></FormItem>
                    )}/>
                  </div>
                ))}
                {effectiveIsEditing && (
                  <Button type="button" variant="outline" size="sm" onClick={() => appendWage({ date: '', newWage: undefined, newTitle: '', notes: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Wage/Role Change
                  </Button>
                )}
                {!effectiveIsEditing && employee.wageHistory?.length === 0 && <p>No wage history listed.</p>}
                {!effectiveIsEditing && employee.wageHistory && employee.wageHistory.length > 0 && !wageFields.length && (
                     <ul className="list-disc pl-5 space-y-2">
                        {employee.wageHistory.map(entry => (
                            <li key={entry.id}>
                                <strong>{formatDateForDisplay(entry.date)}:</strong>
                                {entry.newTitle && ` ${entry.newTitle}`}
                                {entry.newWage && ` - $${entry.newWage.toFixed(2)}/hr`}
                                {entry.notes && <p className="text-xs text-muted-foreground pl-2">Notes: {entry.notes}</p>}
                            </li>
                        ))}
                    </ul>
                )}
              </CardSection>

            </CardContent>
            {effectiveIsEditing && (
              <CardFooter className="border-t pt-6">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4"/> {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}

interface CardSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function CardSection({ title, icon: Icon, children }: CardSectionProps) {
  return (
    <div className="space-y-3 pt-6 border-t first:border-t-0 first:pt-0">
      <h3 className="text-xl font-semibold flex items-center text-foreground/90">
        <Icon className="mr-3 h-5 w-5 text-primary" />
        {title}
      </h3>
      <div className="pl-8">{children}</div>
    </div>
  );
}

export default function EmployeeProfilePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <EmployeeProfileContent />
        </Suspense>
    );
}
