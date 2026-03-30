
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFirestore, useDoc, useMemoFirebase, useStorage } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import SectionWrapper from '@/components/shared/SectionWrapper';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Save, Info, ChevronLeft, Upload, Image as ImageIcon, CheckCircle2, Handshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';

export default function AdminAboutPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const aboutRef = useMemoFirebase(() => doc(db, 'about', 'content'), [db]);
  const { data: aboutContent, loading } = useDoc(aboutRef);
  
  const [formData, setFormData] = useState({
    heroSubtitle: '',
    heroImageUrl: '',
    mission: '',
    vision: '',
    history: '',
    partnersText: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        heroSubtitle: aboutContent.heroSubtitle || '',
        heroImageUrl: aboutContent.heroImageUrl || '',
        mission: aboutContent.mission || '',
        vision: aboutContent.vision || '',
        history: aboutContent.history || '',
        partnersText: aboutContent.partnersText || '',
      });
    }
  }, [aboutContent]);

  if (user?.role !== 'admin') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `about/${Date.now()}-${file.name}`);
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
        setFormData(prev => ({ ...prev, heroImageUrl: downloadURL }));
        setUploadProgress(null);
        toast({ title: 'Upload Successful', description: 'Hero image updated.' });
      }
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(aboutRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: 'Content Updated', description: 'The About Us page has been refreshed with your changes.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionWrapper>
        <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      </SectionWrapper>
    );
  }

  const galleryImages = [
    ...imageData.about.leadership,
    ...imageData.programs,
    ...imageData.news
  ];

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto mb-4">
        <Button asChild variant="ghost" className="group text-muted-foreground hover:text-primary">
          <Link href="/admin">
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Admin Dashboard
          </Link>
        </Button>
      </div>

      <PageTitle title="About Us Management" subtitle="Update your foundation's core values, story, and partners." />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Page Content
            </CardTitle>
            <CardDescription>This information appears on the public "About Us" page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Input 
                placeholder="e.g. Dedicated to empowering individuals..." 
                value={formData.heroSubtitle} 
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image (Team/Collaboration)</label>
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
                    <DialogHeader><DialogTitle>Select from Gallery</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                      {galleryImages.map((img: any, idx) => (
                        <div 
                          key={idx} 
                          className="relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 hover:border-primary transition-all"
                          onClick={() => setFormData(prev => ({ ...prev, heroImageUrl: img.src }))}
                        >
                          <Image src={img.src} alt="Gallery" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              {uploadProgress !== null && <Progress value={uploadProgress} className="h-1 mt-2" />}
              {formData.heroImageUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden border mt-2 max-w-sm">
                  <Image src={formData.heroImageUrl} alt="Hero Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Our Mission</label>
                <Textarea 
                  placeholder="Describe your primary purpose..." 
                  rows={4}
                  value={formData.mission} 
                  onChange={e => setFormData({ ...formData, mission: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Our Vision</label>
                <Textarea 
                  placeholder="What is your long-term goal?" 
                  rows={4}
                  value={formData.vision} 
                  onChange={e => setFormData({ ...formData, vision: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Our History</label>
              <Textarea 
                placeholder="Share the story of how the foundation started..." 
                rows={10}
                value={formData.history} 
                onChange={e => setFormData({ ...formData, history: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Handshake className="h-4 w-4" /> 
                Our Partners & Supporters
              </label>
              <Textarea 
                placeholder="List your key partners or write a message of appreciation..." 
                rows={4}
                value={formData.partnersText} 
                onChange={e => setFormData({ ...formData, partnersText: e.target.value })} 
              />
              <p className="text-[10px] text-muted-foreground italic">This appears at the bottom of the About page.</p>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save All Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
