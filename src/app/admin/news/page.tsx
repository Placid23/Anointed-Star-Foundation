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
import { Plus, Trash2, Edit2, Loader2, Upload, Image as ImageIcon, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import imageData from '@/lib/placeholder-images.json';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminNewsPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const newsQuery = useMemoFirebase(() => {
    return query(collection(db, 'news'), orderBy('date', 'desc'));
  }, [db]);
  
  const { data: news, loading } = useCollection(newsQuery);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', summary: '', content: '', author: '', imageUrl: '' });

  if (user?.role !== 'admin') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `news/${Date.now()}-${file.name}`);
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
        toast({ title: 'Upload Successful', description: 'Image is ready to be published.' });
      }
    );
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    setIsSaving(true);

    try {
      if (isEditing) {
        const docRef = doc(db, 'news', isEditing);
        await updateDoc(docRef, { ...formData, updatedAt: serverTimestamp() });
        toast({ title: 'Article Updated' });
      } else {
        const slug = formData.title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        await addDoc(collection(db, 'news'), {
          ...formData,
          slug,
          date: new Date().toISOString(),
          createdAt: serverTimestamp()
        });
        toast({ title: 'Article Published' });
      }
      setFormData({ title: '', summary: '', content: '', author: '', imageUrl: '' });
      setIsEditing(null);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (article: any) => {
    setIsEditing(article.id);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      author: article.author,
      imageUrl: article.imageUrl
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this article permanently? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        toast({ title: 'Article Deleted', description: 'The story has been removed from the feed.' });
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    }
  };

  const galleryImages = [
    ...imageData.news,
    ...imageData.media.gallery,
    ...imageData.programs
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

      <PageTitle title="News & Blog Management" subtitle="Share updates and stories from the foundation." />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-md h-fit sticky top-20">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Article' : 'Create New Article'}</CardTitle>
            <CardDescription>Fill in the details for your blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Article Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <Input placeholder="Author Name" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Article Cover Image</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Local Upload
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ImageIcon className="mr-2 h-4 w-4" /> Gallery
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select from Gallery</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                      {galleryImages.map((img: any, idx) => (
                        <div 
                          key={idx} 
                          className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${formData.imageUrl === img.src ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                          onClick={() => setFormData({ ...formData, imageUrl: img.src })}
                        >
                          <Image src={img.src} alt="Gallery" fill className="object-cover" />
                          {formData.imageUrl === img.src && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle2 className="text-primary h-8 w-8" />
                            </div>
                          )}
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
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6" 
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              )}
            </div>

            <Textarea placeholder="Short Summary (shown on cards)" rows={2} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
            <Textarea placeholder="Full Article Content" rows={10} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
            
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleSave} disabled={isSaving || uploadProgress !== null}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isEditing ? 'Update Article' : 'Publish Article'}
            </Button>
            {isEditing && (
              <Button variant="ghost" className="w-full" onClick={() => { setIsEditing(null); setFormData({ title: '', summary: '', content: '', author: '', imageUrl: '' }); }}>
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Existing Articles</CardTitle>
            <CardDescription>Manage your published stories and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news?.map((article: any) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell className="text-muted-foreground">{article.author}</TableCell>
                      <TableCell className="text-xs">{new Date(article.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="ghost" className="hover:text-primary" onClick={() => handleEdit(article)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="hover:text-destructive" onClick={() => handleDelete(article.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {news?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No news articles found.</TableCell>
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
