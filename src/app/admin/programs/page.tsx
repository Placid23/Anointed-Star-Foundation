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
import { Plus, Trash2, Edit2, Loader2, FolderHeart, Globe, MapPin, Upload, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import imageData from '@/lib/placeholder-images.json';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProgramsPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const programQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), orderBy('title', 'asc'));
  }, [db]);
  
  const { data: programs, loading } = useCollection(programQuery);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    imageUrl: '',
    locationName: '',
  });

  if (user?.role !== 'admin') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `programs/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        setUploadProgress(null);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData({ ...formData, imageUrl: downloadURL });
        setUploadProgress(null);
        toast({ title: 'Upload Successful', description: 'Program image is ready.' });
      }
    );
  };

  const handleSave = async () => {
    if (!formData.title || !formData.shortDescription) {
      toast({ title: 'Missing Information', description: 'Title and short description are required.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const slug = formData.title.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const programData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        imageUrl: formData.imageUrl || 'https://picsum.photos/seed/default/600/400',
        slug,
        location: { name: formData.locationName || 'Global', lat: 0, lng: 0 },
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(db, 'programs', isEditing), programData);
        toast({ title: 'Program Updated' });
      } else {
        await addDoc(collection(db, 'programs'), {
          ...programData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Program Created' });
      }
      
      resetForm();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', shortDescription: '', longDescription: '', imageUrl: '', locationName: '' });
    setIsEditing(null);
  };

  const handleEdit = (program: any) => {
    setIsEditing(program.id);
    setFormData({
      title: program.title,
      shortDescription: program.shortDescription,
      longDescription: program.longDescription,
      imageUrl: program.imageUrl || '',
      locationName: program.location?.name || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'programs', id));
        toast({ title: 'Program Deleted', description: 'The initiative has been removed from the platform.' });
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    }
  };

  const galleryImages = [
    ...imageData.programs,
    ...imageData.media.gallery,
    ...imageData.news
  ];

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

      <PageTitle title="Program Management" subtitle="Manage your foundation's impact initiatives." />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-md h-fit sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderHeart className="h-5 w-5 text-primary" />
              {isEditing ? 'Edit Program' : 'Create New Program'}
            </CardTitle>
            <CardDescription>Update initiative details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Program Title</label>
              <Input placeholder="e.g. Youth Empowerment" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Cover Image</label>
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
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Foundation Gallery</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                      {galleryImages.map((img: any, idx) => (
                        <div 
                          key={idx} 
                          className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${formData.imageUrl === img.src ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                          onClick={() => setFormData({ ...formData, imageUrl: img.src })}
                        >
                          <Image src={img.src} alt="Gallery" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              
              {uploadProgress !== null && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-1" />
                  <p className="text-[10px] text-center text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              )}

              {formData.imageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden border mt-2">
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</label>
              <Input placeholder="e.g. Lagos, Nigeria" value={formData.locationName} onChange={e => setFormData({ ...formData, locationName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Short Summary</label>
              <Textarea placeholder="Brief teaser..." rows={2} value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Long Description</label>
              <Textarea placeholder="Full details..." rows={6} value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleSave} disabled={isSaving || uploadProgress !== null}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {isEditing ? 'Update Program' : 'Publish Program'}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Globe className="h-5 w-5 text-primary" /> Active Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs?.map((program: any) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell className="text-muted-foreground">{program.location?.name || 'Global'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="ghost" className="hover:text-primary" onClick={() => handleEdit(program)} title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:text-destructive" onClick={() => handleDelete(program.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {programs?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">No programs found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
