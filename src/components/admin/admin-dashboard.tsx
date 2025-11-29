
'use client';

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Mail, Trash2, Edit, PlusCircle, Loader2, Star, PhoneCall, Check, ChevronDown, ChevronUp, Search, Eye, HomeIcon } from "lucide-react";
import { format } from "date-fns";
import type { ContactMessage, Project, FlatType, CallbackRequest, Note, SiteSettings } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth, useCollection, useFirestore, deleteDocumentNonBlocking, setDocumentNonBlocking, initiateAnonymousSignIn, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp, writeBatch, getDocs, where, limit, arrayUnion, updateDoc, getDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

function HomepageSettingsTab() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const settingsId = "homepage_settings"; // Hardcoded ID for the single settings document

    const settingsRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'site_settings', settingsId);
    }, [firestore]);

    const { data: settings, isLoading } = useDoc<SiteSettings>(settingsRef);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<{ heroImageUrl: string }>({
        resolver: zodResolver(z.object({
            heroImageUrl: z.string().url("Please enter a valid URL.").or(z.literal('')),
        })),
        defaultValues: {
            heroImageUrl: ""
        }
    });

    useEffect(() => {
        if (settings) {
            setValue("heroImageUrl", settings.heroImageUrl || "");
        }
    }, [settings, setValue]);

    const onSubmit = async (data: { heroImageUrl: string }) => {
        if (!firestore) {
            toast({ variant: "destructive", title: "Error", description: "Firestore not available." });
            return;
        }

        try {
            setDocumentNonBlocking(settingsRef!, data, { merge: true });
            toast({ title: "Success", description: "Homepage settings updated!" });
        } catch (error) {
            console.error("Error updating settings:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update settings." });
        }
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Homepage Settings</CardTitle>
                    <CardDescription>Manage content for the homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </CardContent>
             </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Homepage Settings</CardTitle>
                <CardDescription>Manage content for the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroImageUrl">Hero Section Image URL</Label>
                        <Input
                            id="heroImageUrl"
                            placeholder="https://example.com/hero-image.jpg"
                            {...register("heroImageUrl")}
                        />
                        {errors.heroImageUrl && <p className="text-sm text-destructive">{errors.heroImageUrl.message}</p>}
                        <p className="text-xs text-muted-foreground">This image will be displayed in the main hero section of your homepage.</p>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function ContactMessagesTab() {
  const firestore = useFirestore();
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available.' });
      return;
    }
    deleteDocumentNonBlocking(doc(firestore, 'contact_messages', id));
    toast({ title: 'Success', description: 'Message deleted.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>Messages submitted through the website's contact form.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && messages && messages.length > 0 ? messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.createdAt ? format(new Date((message.createdAt as any).seconds * 1000), 'dd MMM yyyy, HH:mm') : 'N/A'}</TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>View Message</DialogTitle>
                        <DialogDescription>
                          From: {message.name} ({message.email})
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p><strong>Phone:</strong> {message.phone}</p>
                        <p><strong>Received:</strong> {message.createdAt ? format(new Date((message.createdAt as any).seconds * 1000), 'dd MMM yyyy, HH:mm') : 'N/A'}</p>
                        <Separator />
                        <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/50 p-4">
                          <p className="whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                      <DialogFooter>
                         <DialogClose asChild>
                           <Button>Close</Button>
                         </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the message. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(message.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">No messages yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function CallbackRequestRow({ request }: { request: CallbackRequest }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleAddNote = async () => {
        if (!note.trim()) {
            toast({ variant: 'destructive', title: 'Note cannot be empty.' });
            return;
        }
        if (!firestore) return;

        setIsSubmitting(true);
        try {
            const requestRef = doc(firestore, 'callback_requests', request.id);
            const docSnap = await getDoc(requestRef);

            if (!docSnap.exists()) {
                throw new Error("Document does not exist.");
            }
            
            const existingNotes = docSnap.data().notes || [];
            const newNote = {
                text: note,
                createdAt: new Date(), // Use client-side JS Date
            };

            const updatedNotes = [...existingNotes, newNote];
            
            const updateData = {
              notes: updatedNotes,
              ...(request.status === 'New' && { status: 'Contacted' }),
            };

            await updateDoc(requestRef, updateData);
            
            toast({ title: 'Note added successfully.' });
            setNote('');
        } catch (error) {
            console.error("Error adding note:", error);
            toast({ variant: 'destructive', title: 'Failed to add note.', description: (error as Error).message });
        } finally {
             setIsSubmitting(false);
        }
    };
    
    // Sort notes, newest first
    const sortedNotes = request.notes ? [...request.notes].sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as any).seconds * 1000;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as any).seconds * 1000;
        return dateB - dateA;
    }) : [];

    return (
        <>
            <TableRow onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
                <TableCell>{request.createdAt ? format(new Date((request.createdAt as any).seconds * 1000), 'dd MMM yyyy, HH:mm') : 'N/A'}</TableCell>
                <TableCell>{request.projectName}</TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell><Badge variant={request.status === 'New' ? 'destructive' : 'secondary'}>{request.status}</Badge></TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={6}>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-2">Notes</h4>
                            <div className="space-y-4 mb-4">
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Add a new note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={2}
                                    />
                                    <Button onClick={handleAddNote} disabled={isSubmitting} size="sm">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Note
                                    </Button>
                                </div>
                                 <Separator />
                                {sortedNotes && sortedNotes.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                                        {sortedNotes.map((n, index) => (
                                            <div key={index} className="text-sm p-2 bg-background rounded-md">
                                                <p className="whitespace-pre-wrap">{n.text}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {n.createdAt 
                                                        ? format(n.createdAt instanceof Date ? n.createdAt : new Date((n.createdAt as any).seconds * 1000), 'dd MMM yyyy, HH:mm') 
                                                        : 'Just now'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                                )}
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}


function CallbackRequestsTab() {
    const firestore = useFirestore();
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'callback_requests'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: requests, isLoading } = useCollection<CallbackRequest>(requestsQuery);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Callback Requests</CardTitle>
                <CardDescription>Leads generated from the "Request a Call" feature. Click a row to view/add notes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Received</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && requests && requests.length > 0 ? requests.map((request) => (
                            <CallbackRequestRow key={request.id} request={request} />
                        )) : !isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">No callback requests yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

const flatTypeSchema = z.object({
  name: z.string().min(1, "Type name is required."),
  area: z.coerce.number().min(1, "Area must be greater than 0."),
  bedrooms: z.coerce.number().min(0, "Bedrooms required."),
  bathrooms: z.coerce.number().min(0, "Bathrooms required."),
  verandas: z.coerce.number().min(0, "Verandas required."),
});

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  shortDescription: z.string().min(10, "Short description is required."),
  description: z.string().min(20, "Full description is required."),
  imageUrls: z.array(z.object({ value: z.string().url("Invalid URL") })).min(1, "At least one image URL is required."),
  location: z.string().min(3, "Location is required."),
  status: z.enum(['Completed', 'Under Construction', 'Sold', 'Upcoming']),
  flatTypes: z.array(flatTypeSchema).min(1, "At least one flat type is required."),
  elevator: z.coerce.number().min(0, "Number of elevators is required."),
  landArea: z.string().min(1, "Land area is required."),
  level: z.string().min(1, "Level information is required."),
  parking: z.string().min(1, "Parking information is required."),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function ProjectForm({ project, onSave }: { project?: Project, onSave: () => void }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      shortDescription: project?.shortDescription || "",
      description: project?.description || "",
      imageUrls: project?.imageUrls?.map(url => ({ value: url })) || [{ value: "" }],
      location: project?.location || "",
      status: project?.status || "Under Construction",
      flatTypes: project?.flatTypes && project.flatTypes.length > 0 ? project.flatTypes : [{ name: 'Type A', area: 0, bedrooms: 0, bathrooms: 0, verandas: 0 }],
      elevator: project?.elevator || 1,
      landArea: project?.landArea || "",
      level: project?.level || "",
      parking: project?.parking || "",
      metaTitle: project?.metaTitle || "",
      metaDescription: project?.metaDescription || "",
      metaKeywords: project?.metaKeywords || "",
    }
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "imageUrls"
  });

  const { fields: flatTypeFields, append: appendFlatType, remove: removeFlatType } = useFieldArray({
    control,
    name: "flatTypes"
  });

  const { toast } = useToast();
  const firestore = useFirestore();

  const processSubmit = async (data: ProjectFormValues) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore not initialized." });
      return;
    }

    try {
      const urls = data.imageUrls.map(img => img.value).filter(url => url.trim() !== '');
      if (urls.length === 0) {
        toast({ variant: "destructive", title: "Validation Error", description: "At least one valid image URL is required." });
        return;
      }

      const projectData = {
        ...data,
        imageUrls: urls,
      };

      if (project?.id) {
        const projectRef = doc(firestore, 'projects', project.id);
        setDocumentNonBlocking(projectRef, projectData, { merge: true });
        toast({ title: "Success", description: `Project updated successfully.` });
      } else {
        const newDocRef = doc(collection(firestore, 'projects'));
        const newProjectData = {
          ...projectData,
          id: newDocRef.id,
          isFeatured: false,
          createdAt: serverTimestamp(),
        };
        setDocumentNonBlocking(newDocRef, newProjectData, {});
        toast({ title: "Success", description: `Project added successfully.` });
      }
      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save project." });
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      <Tabs defaultValue="main">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main Details</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="main" className="mt-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea id="shortDescription" {...register("shortDescription")} />
                {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" {...register("description")} rows={5} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-2">
                <Label>Image URLs</Label>
                {imageFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <Input
                    {...register(`imageUrls.${index}.value`)}
                    placeholder="https://example.com/image.jpg"
                    />
                    <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                    disabled={imageFields.length <= 1}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                ))}
                {errors.imageUrls && <p className="text-sm text-destructive">{errors.imageUrls.message || errors.imageUrls.root?.message}</p>}
                <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendImage({ value: "" })}
                >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="location">Location URL</Label>
                <Input id="location" {...register("location")} placeholder="https://maps.app.goo.gl/..."/>
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" {...register("status")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Under Construction</option>
                    <option>Completed</option>
                    <option>Sold</option>
                    <option>Upcoming</option>
                </select>
                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area</Label>
                    <Input id="landArea" {...register("landArea")} placeholder="e.g. 5 Katha"/>
                    {errors.landArea && <p className="text-sm text-destructive">{errors.landArea.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Input id="level" {...register("level")} placeholder="e.g. G+9"/>
                    {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="elevator">Elevators</Label>
                    <Input id="elevator" type="number" {...register("elevator")} />
                    {errors.elevator && <p className="text-sm text-destructive">{errors.elevator.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="parking">Parking</Label>
                    <Input id="parking" {...register("parking")} placeholder="e.g. 10 slots"/>
                    {errors.parking && <p className="text-sm text-destructive">{errors.parking.message}</p>}
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Flat Types</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendFlatType({ name: `Type ${String.fromCharCode(65 + flatTypeFields.length)}`, area: 0, bedrooms: 0, bathrooms: 0, verandas: 0 })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Flat Type
                    </Button>
                </div>
                {flatTypeFields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border p-4 space-y-4 relative">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-1 col-span-2">
                            <Label htmlFor={`flatTypes.${index}.name`}>Type Name</Label>
                            <Input id={`flatTypes.${index}.name`} {...register(`flatTypes.${index}.name`)} placeholder="e.g. Type A" />
                            {errors.flatTypes?.[index]?.name && <p className="text-sm text-destructive">{errors.flatTypes?.[index]?.name?.message}</p>}
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor={`flatTypes.${index}.area`}>Area (sqft)</Label>
                            <Input id={`flatTypes.${index}.area`} type="number" {...register(`flatTypes.${index}.area`)} />
                            {errors.flatTypes?.[index]?.area && <p className="text-sm text-destructive">{errors.flatTypes?.[index]?.area?.message}</p>}
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor={`flatTypes.${index}.bedrooms`}>Bedrooms</Label>
                            <Input id={`flatTypes.${index}.bedrooms`} type="number" {...register(`flatTypes.${index}.bedrooms`)} />
                            {errors.flatTypes?.[index]?.bedrooms && <p className="text-sm text-destructive">{errors.flatTypes?.[index]?.bedrooms?.message}</p>}
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor={`flatTypes.${index}.bathrooms`}>Bathrooms</Label>
                            <Input id={`flatTypes.${index}.bathrooms`} type="number" {...register(`flatTypes.${index}.bathrooms`)} />
                            {errors.flatTypes?.[index]?.bathrooms && <p className="text-sm text-destructive">{errors.flatTypes?.[index]?.bathrooms?.message}</p>}
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor={`flatTypes.${index}.verandas`}>Verandas</Label>
                            <Input id={`flatTypes.${index}.verandas`} type="number" {...register(`flatTypes.${index}.verandas`)} />
                            {errors.flatTypes?.[index]?.verandas && <p className="text-sm text-destructive">{errors.flatTypes?.[index]?.verandas?.message}</p>}
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeFlatType(index)}
                            disabled={flatTypeFields.length <= 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {errors.flatTypes && <p className="text-sm text-destructive">{errors.flatTypes.message || errors.flatTypes.root?.message}</p>}
            </div>
        </TabsContent>
        <TabsContent value="seo" className="mt-6 space-y-6">
             <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" {...register("metaTitle")} placeholder="e.g. Luxury Apartments in Downtown" />
                <p className="text-xs text-muted-foreground">Appears in the browser tab and search engine results. Keep it concise.</p>
                {errors.metaTitle && <p className="text-sm text-destructive">{errors.metaTitle.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" {...register("metaDescription")} placeholder="e.g. Discover stunning, modern apartments with premium amenities..." />
                <p className="text-xs text-muted-foreground">A brief summary of the page for search results. Aim for 150-160 characters.</p>
                {errors.metaDescription && <p className="text-sm text-destructive">{errors.metaDescription.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input id="metaKeywords" {...register("metaKeywords")} placeholder="e.g. apartment, real estate, luxury living, downtown" />
                <p className="text-xs text-muted-foreground">Comma-separated keywords relevant to the project.</p>
                {errors.metaKeywords && <p className="text-sm text-destructive">{errors.metaKeywords.message}</p>}
            </div>
        </TabsContent>
      </Tabs>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
           <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project?.id ? "Update Project" : "Add Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}


function ProjectsTab() {
  const firestore = useFirestore();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore]);
    
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
     if (!firestore || !id) {
      toast({ variant: "destructive", title: "Error", description: "Firestore not initialized or project ID missing." });
      return;
    }
    deleteDocumentNonBlocking(doc(firestore, 'projects', id));
    toast({ title: "Success", description: "Project deleted successfully." });
  };

  const handleToggleFeatured = async (projectId: string, currentFeaturedState: boolean) => {
    if (!firestore) return;

    const projectRef = doc(firestore, 'projects', projectId);
    const newFeaturedState = !currentFeaturedState;

    try {
        if (newFeaturedState) {
            // If turning a project ON, we need to turn any other featured project OFF.
            const batch = writeBatch(firestore);
            const featuredQuery = query(collection(firestore, 'projects'), where('isFeatured', '==', true), limit(1));
            const featuredSnapshot = await getDocs(featuredQuery);

            if (!featuredSnapshot.empty) {
                const currentFeaturedDoc = featuredSnapshot.docs[0];
                if (currentFeaturedDoc.id !== projectId) {
                    batch.update(currentFeaturedDoc.ref, { isFeatured: false });
                }
            }
            batch.update(projectRef, { isFeatured: true });
            await batch.commit();
            toast({ title: "Success", description: "Featured project updated." });
        } else {
            // If turning a project OFF, just update it.
            await updateDoc(projectRef, { isFeatured: false });
            toast({ title: "Success", description: "Project un-featured." });
        }
    } catch (error) {
        console.error('Error toggling featured project:', error);
        toast({ variant: "destructive", title: "Error", description: "Failed to update featured project." });
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Projects</CardTitle>
          <CardDescription>Add, edit, or remove projects.</CardDescription>
        </div>
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Fill in the details for the new project.</DialogDescription>
            </DialogHeader>
             <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
                <ProjectForm onSave={() => setIsAddFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading && (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                </TableRow>
            )}
            {!isLoading && projects && projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <Switch
                    checked={project.isFeatured || false}
                    onCheckedChange={() => handleToggleFeatured(project.id, project.isFeatured || false)}
                    aria-label="Toggle featured status"
                  />
                </TableCell>
                <TableCell className="space-x-1 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-blue-500" /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                       <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update the details for this project.</DialogDescription>
                      </DialogHeader>
                       <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
                          <ProjectForm project={project} onSave={() => {
                            // A bit of a hack to close the dialog
                            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                          }} />
                      </div>
                    </DialogContent>
                  </Dialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the project.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && (!projects || projects.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No projects found. Add one!</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const auth = useAuth();

  useEffect(() => {
    // We need to ensure the user is authenticated, even anonymously,
    // to satisfy the security rules for writing data.
    if (auth && !auth.currentUser) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building className="h-8 w-8 text-primary" />
                    <h1 className="font-headline text-xl font-bold text-primary">Admin Dashboard</h1>
                </div>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="callbacks">
          <TabsList className="mx-auto grid w-full max-w-xl grid-cols-5">
            <TabsTrigger value="homepage"><HomeIcon className="mr-2 h-4 w-4"/>Homepage</TabsTrigger>
            <TabsTrigger value="callbacks"><PhoneCall className="mr-2 h-4 w-4"/>Callbacks</TabsTrigger>
            <TabsTrigger value="projects"><Building className="mr-2 h-4 w-4"/>Projects</TabsTrigger>
            <TabsTrigger value="messages"><Mail className="mr-2 h-4 w-4"/>Messages</TabsTrigger>
            <TabsTrigger value="seo"><Search className="mr-2 h-4 w-4"/>SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="homepage" className="mt-6">
            <HomepageSettingsTab />
          </TabsContent>
           <TabsContent value="callbacks" className="mt-6">
            <CallbackRequestsTab />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <ContactMessagesTab />
          </TabsContent>
           <TabsContent value="seo" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>SEO Management</CardTitle>
                    <CardDescription>Manage your site's SEO from the projects tab. Edit a project to update its SEO details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>To manage the SEO for a specific project, please go to the "Projects" tab, click the "Edit" button for the desired project, and navigate to the "SEO" tab within the form.</p>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

