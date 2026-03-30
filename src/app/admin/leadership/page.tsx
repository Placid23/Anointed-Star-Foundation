'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection, useFirestore, useMemoFirebase, useStorage } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Loader2, Users, Upload, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import imageData from '@/lib/placeholder-images.json';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLeadershipPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const leadershipQuery = useMemoFirebase(() => {
    return query(collection(db, 'leadership'), orderBy('order', 'asc'));
  }, [db]);
  
  const { data: members, loading } = useCollection(leadershipQuery);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', imageUrl: '', order: 0 });

  if (user?.role !== 'admin') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `leadership/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(isNaN(progress) ? 0 : progress);
      }, 
      (error) => {
        toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        setUploadProgress(null);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
        setUploadProgress(null);
        toast({ title: 'Upload Successful' });
      }
    );
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role) return;
    setIsSaving(true);
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'leadership', isEditing), { ...formData, updatedAt: serverTimestamp() });
        toast({ title: 'Member Updated' });
      } else {
        await addDoc(collection(db, 'leadership'), { ...formData, createdAt: serverTimestamp() });
        toast({ title: 'Member Added' });
      }
      setFormData({ name: '', role: '', bio: '', imageUrl: '', order: (members?.length || 0) + 1 });
      setIsEditing(null);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (member: any) => {
    setIsEditing(member.id);
    setFormData({ 
      name: member.name, 
      role: member.role, 
      bio: member.bio, 
      imageUrl: member.imageUrl, 
      order: typeof member.order === 'number' ? member.order : 0 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this member from leadership?')) {
      try {
        await deleteDoc(doc(db, 'leadership', id));
        toast({ title: 'Member Removed' });
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    }
  };

  return (
    <SectionWrapper>
      <div className="max-w-6xl mx-auto mb-4">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary">
          <Link href="/admin">
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Admin Dashboard
          </Link>
        </Button>
      </div>

      <PageTitle title="Leadership Management" subtitle="Manage the faces behind Anointed Foundation." />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-md h-fit sticky top-20">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Leader' : 'Add New Leader'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Input placeholder="Role (e.g. Founder & CEO)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Portrait Image</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ImageIcon className="mr-2 h-4 w-4" /> Gallery
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Leadership Portrait Gallery</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 p-2">
                      {imageData.about.leadership.map((img: any, idx) => (
                        <div key={idx} className="relative aspect-square cursor-pointer" onClick={() => setFormData(p => ({ ...p, imageUrl: img.src }))}>
                          <Image src={img.src} alt="Lead" fill className="object-cover rounded-full" />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              {uploadProgress !== null && <Progress value={uploadProgress} className="h-1" />}
              {formData.imageUrl && (
                <div className="flex justify-center mt-2">
                   <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
                    <Image src={formData.imageUrl} alt="Lead Preview" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>

            <Textarea placeholder="Short Bio" rows={4} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
            <Input 
              type="number" 
              placeholder="Display Order (0, 1, 2...)" 
              value={formData.order.toString()} 
              onChange={e => {
                const val = parseInt(e.target.value);
                setFormData({ ...formData, order: isNaN(val) ? 0 : val });
              }} 
            />
            
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : isEditing ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader><CardTitle>The Leadership Team</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((m: any) => (
                    <TableRow key={m.id}>
                      <TableCell className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={m.imageUrl || 'https://picsum.photos/seed/placeholder/100/100'} alt={m.name} fill className="object-cover" />
                        </div>
                        <span className="font-medium">{m.name}</span>
                      </TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="hover:text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}