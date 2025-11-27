'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, LogOut, Mail, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { ContactMessage, Project } from "@/lib/types";
import { logout, deleteMessage } from '@/lib/actions';
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
import { useCollection, useFirestore, useAuth, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';


function MessagesTab() {
    const firestore = useFirestore();
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'contact_messages'), orderBy('createdAt', 'desc'));
    }, [firestore]);
    
    const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        try {
            await deleteMessage(id);
            toast({
                title: "Success",
                description: "Message deleted successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete message.",
            });
        }
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
                    <TableCell colSpan={6} className="text-center h-24">Loading messages...</TableCell>
                </TableRow>
            )}
            {!isLoading && messages && messages.length > 0 ? messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.createdAt ? format(new Date(message.createdAt.seconds * 1000), 'dd MMM yyyy') : 'N/A'}</TableCell>
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
                    <TableCell colSpan={6} className="text-center h-24">No messages yet.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProjectsTab() {
  const firestore = useFirestore();
    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'projects'), orderBy('title', 'asc'));
    }, [firestore]);
    
    const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Projects</CardTitle>
        <CardDescription>Add, edit, or remove projects.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Project management UI will go here */}
        <div className="text-center py-10">
          <p className="text-muted-foreground">Project management functionality is coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const auth = useAuth();
  
  const handleLogout = async () => {
    await auth?.signOut();
    await logout();
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-2">
                    <Building className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold text-primary font-headline">Admin Dashboard</h1>
                </div>
                <form action={handleLogout}>
                    <Button variant="ghost" type="submit">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </form>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="messages">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
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
