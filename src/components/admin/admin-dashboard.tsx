'use client';

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Mail, Trash2, Edit, PlusCircle, Loader2, Star } from "lucide-react";
import { format } from "date-fns";
import type { ContactMessage, Project } from "@/lib/types";
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
import { useAuth, useCollection, useFirestore, deleteDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking, initiateAnonymousSignIn } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp, writeBatch, getDocs, where, limit } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function MessagesTab() {
    const firestore = useFirestore();
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'));
    }, [firestore]);
    
    const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!firestore) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Firestore is not available.",
            });
            return;
        }
        deleteDocumentNonBlocking(doc(firestore, "contact_messages", id));
        toast({
            title: "Success",
            description: "Message deleted successfully.",
        });
    };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>Messages submitted through the contact form.</CardDescription>
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
                <TableCell>{message.createdAt ? format(new Date((message.createdAt as any).seconds * 1000), 'dd MMM yyyy') : 'N/A'}</TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the message.
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

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  shortDescription: z.string().min(10, "Short description is required."),
  description: z.string().min(20, "Full description is required."),
  images: z.array(z.object({ value: z.string().url("Invalid URL") })).min(1, "At least one image URL is required."),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be a positive number."),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be a positive number."),
  area: z.coerce.number().min(1, "Area must be greater than 0."),
  location: z.string().min(3, "Location is required."),
  status: z.enum(['Completed', 'Under Construction', 'Sold']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function ProjectForm({ project, onSave }: { project?: Project, onSave: () => void }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      shortDescription: project?.shortDescription || "",
      description: project?.description || "",
      images: Array.isArray(project?.images) ? project.images.map(url => ({ value: url })) : [{ value: "" }],
      bedrooms: project?.bedrooms || 0,
      bathrooms: project?.bathrooms || 0,
      area: project?.area || 0,
      location: project?.location || "",
      status: project?.status || "Under Construction",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images"
  });

  const { toast } = useToast();
  const firestore = useFirestore();

  const processSubmit = async (data: ProjectFormValues) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore not initialized." });
      return;
    }

    try {
      const imageUrls = data.images.map(img => img.value);

      const projectData = {
        ...data,
        images: imageUrls,
      };

      if (project?.id) {
        const projectRef = doc(firestore, 'projects', project.id);
        updateDocumentNonBlocking(projectRef, projectData);
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
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
       <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input id="shortDescription" {...register("shortDescription")} />
        {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Image URLs</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`images.${index}.value`)}
              placeholder="https://example.com/image.jpg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
         {errors.images && <p className="text-sm text-destructive">{errors.images.message || errors.images.root?.message}</p>}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
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
          </select>
          {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" {...register("bedrooms")} />
          {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" {...register("bathrooms")} />
          {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="area">Area (sqft)</Label>
          <Input id="area" type="number" {...register("area")} />
          {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
        </div>
      </div>
      <DialogFooter>
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

  const handleSetFeatured = async (projectIdToFeature: string) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    
    const featuredQuery = query(collection(firestore, 'projects'), where('isFeatured', '==', true), limit(1));
    const featuredSnapshot = await getDocs(featuredQuery);
    
    if (!featuredSnapshot.empty) {
      const currentFeaturedDoc = featuredSnapshot.docs[0];
      if (currentFeaturedDoc.id !== projectIdToFeature) {
        batch.update(currentFeaturedDoc.ref, { isFeatured: false });
      }
    }
    
    const newFeaturedRef = doc(firestore, 'projects', projectIdToFeature);
    batch.update(newFeaturedRef, { isFeatured: true });
    
    try {
      await batch.commit();
      toast({ title: "Success", description: "Featured project updated." });
    } catch (error) {
      console.error('Error setting featured project:', error);
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
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Fill in the details for the new project.</DialogDescription>
            </DialogHeader>
            <ProjectForm onSave={() => setIsAddFormOpen(false)} />
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading && (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                </TableRow>
            )}
            {!isLoading && projects && projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  {project.title}
                  {project.isFeatured && <Star className="ml-2 inline-block h-4 w-4 fill-yellow-400 text-yellow-500" />}
                </TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell className="space-x-1 text-right">
                  <Button variant="outline" size="sm" onClick={() => handleSetFeatured(project.id)} disabled={project.isFeatured}>
                    <Star className="mr-1 h-4 w-4" />
                    Feature
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-blue-500" /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                       <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update the details for this project.</DialogDescription>
                      </DialogHeader>
                      <ProjectForm project={project} onSave={() => {
                        // A bit of a hack to close the dialog
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                      }} />
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
                    <TableCell colSpan={4} className="h-24 text-center">No projects found. Add one!</TableCell>
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
        <Tabs defaultValue="projects">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="messages"><Mail className="mr-2 h-4 w-4"/>Messages</TabsTrigger>
            <TabsTrigger value="projects"><Building className="mr-2 h-4 w-4"/>Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="messages" className="mt-6">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

    