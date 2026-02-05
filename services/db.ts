import { supabase } from './supabase.ts';
import { User, Resource, Submission, LoginRecord, ResourceType, CoursePattern, DegreeLevel } from '../types.ts';
import { MOCK_RESOURCES } from '../constants.ts';

const mapResource = (row: any): Resource => ({
  id: row.id,
  title: row.title,
  collegeId: row.college_id,
  subjectId: row.subject_id,
  semester: row.semester,
  year: row.year,
  type: row.type as ResourceType,
  pattern: row.pattern as CoursePattern,
  degreeLevel: row.degree_level as DegreeLevel,
  downloadUrl: row.download_url,
  size: row.size,
  downloadCount: row.download_count,
  createdAt: row.created_at,
});

const mapResourceToRow = (res: Resource) => ({
  id: res.id,
  title: res.title,
  college_id: res.collegeId,
  subject_id: res.subjectId,
  semester: res.semester,
  year: res.year,
  type: res.type,
  pattern: res.pattern,
  degree_level: res.degreeLevel,
  download_url: res.downloadUrl,
  size: res.size,
  download_count: res.downloadCount,
  created_at: res.createdAt
});

const mapSubmission = (row: any): Submission => ({
  id: row.id,
  userId: row.user_id,
  userIdentifier: row.user_identifier,
  fileName: row.file_name,
  fileUrl: row.file_path, 
  subjectId: row.subject_id,
  subjectName: row.subject_name,
  semester: row.semester,
  type: row.type as ResourceType,
  status: row.status as 'pending' | 'approved' | 'rejected',
  timestamp: row.timestamp,
  creditsEarned: row.credits_earned,
  pattern: row.pattern as CoursePattern,
  degreeLevel: row.degree_level as DegreeLevel,
  collegeId: row.college_id
});

export const db = {
  async getAllResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      if (data === null || data.length === 0) return MOCK_RESOURCES;
      return [];
    }
    
    if (data.length === 0) return MOCK_RESOURCES;

    return data.map(mapResource);
  },

  async addResource(resource: Resource): Promise<void> {
    const row = mapResourceToRow(resource);
    const { error } = await supabase.from('resources').insert(row);
    if (error) console.error('Error adding resource:', error);
  },

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) console.error('Error deleting resource:', error);
  },

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;

    return {
      id: data.id,
      identifier: data.email,
      name: data.name,
      collegeId: data.college_id,
      isLoggedIn: true,
      credits: data.credits,
      assessmentHistory: data.assessment_history,
      savedResources: data.saved_resources || []
    };
  },

  async saveUser(user: User): Promise<void> {
    const row = {
      id: user.id,
      email: user.identifier,
      name: user.name,
      college_id: user.collegeId,
      credits: user.credits,
      assessment_history: user.assessmentHistory,
      saved_resources: user.savedResources
    };

    const { error } = await supabase.from('profiles').upsert(row);
    if (error) console.error('Error saving user profile:', error);
  },

  async toggleFavorite(userId: string, resourceId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('saved_resources')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error("Error fetching favorites", error);
        return [];
    }

    let current: string[] = data?.saved_resources || [];
    
    if (current.includes(resourceId)) {
        current = current.filter(id => id !== resourceId);
    } else {
        current.push(resourceId);
    }

    await supabase.from('profiles').update({ saved_resources: current }).eq('id', userId);
    return current;
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data) return [];
    
    return data.map(d => ({
      id: d.id,
      identifier: d.email,
      name: d.name,
      collegeId: d.college_id,
      isLoggedIn: false,
      credits: d.credits,
      assessmentHistory: d.assessment_history,
      savedResources: d.saved_resources
    }));
  },

  async getAllSubmissions(): Promise<Submission[]> {
    const { data, error } = await supabase.from('submissions').select('*');
    if (error || !data) return [];
    return data.map(mapSubmission);
  },

  async addSubmission(submission: Submission, file?: File | Blob): Promise<void> {
    let filePath = '';
    if (file) {
      const fileName = `${submission.userId}/${submission.timestamp}_${submission.fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Upload failed:', uploadError);
        return;
      }
      filePath = fileName;
    }

    const row = {
      id: submission.id,
      user_id: submission.userId,
      user_identifier: submission.userIdentifier,
      file_name: submission.fileName,
      file_path: filePath,
      subject_id: submission.subjectId,
      subject_name: submission.subjectName,
      semester: submission.semester,
      type: submission.type,
      status: submission.status,
      timestamp: submission.timestamp,
      credits_earned: submission.creditsEarned,
      pattern: submission.pattern,
      degree_level: submission.degreeLevel,
      college_id: submission.collegeId
    };

    const { error } = await supabase.from('submissions').insert(row);
    if (error) console.error('Error creating submission:', error);
  },

  async updateSubmission(submission: Submission): Promise<void> {
    const row = {
      status: submission.status,
      credits_earned: submission.creditsEarned
    };
    const { error } = await supabase.from('submissions').update(row).eq('id', submission.id);
    if (error) console.error('Error updating submission:', error);
  },

  async deleteSubmission(id: string): Promise<void> {
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (error) console.error('Error deleting submission:', error);
  },

  async saveFile(resourceId: string, file: Blob): Promise<void> {
    const fileName = `${resourceId}.pdf`; 
    const { error } = await supabase.storage
        .from('resources')
        .upload(fileName, file, { upsert: true });

    if (error) {
        console.error('File save failed:', error);
        return;
    }

    const { data } = supabase.storage.from('resources').getPublicUrl(fileName);
    const cleanId = resourceId.startsWith('res-') ? resourceId : resourceId;
    await supabase.from('resources').update({ download_url: data.publicUrl }).eq('id', cleanId);
  },

  async getFile(id: string): Promise<Blob | undefined> {
    if (id.startsWith('sub-')) {
       const subId = id.replace('sub-', '');
       const { data: subData } = await supabase.from('submissions').select('file_path').eq('id', subId).single();
       if (subData?.file_path) {
           const { data } = await supabase.storage.from('submissions').download(subData.file_path);
           return data || undefined;
       }
    } else {
       const fileName = `${id}.pdf`;
       const { data } = await supabase.storage.from('resources').download(fileName);
       return data || undefined;
    }
    return undefined;
  },

  async getFileUrl(id: string): Promise<string | undefined> {
     if (id.startsWith('res-')) {
         const { data } = supabase.storage.from('resources').getPublicUrl(`${id}.pdf`);
         return data.publicUrl;
     } else if (id.startsWith('sub-')) {
         const subId = id.replace('sub-', '');
         const { data: subData } = await supabase.from('submissions').select('file_path').eq('id', subId).single();
         if (subData?.file_path) {
             const { data } = await supabase.storage.from('submissions').createSignedUrl(subData.file_path, 60);
             return data?.signedUrl;
         }
     }
     return undefined;
  },

  async addLoginRecord(record: LoginRecord): Promise<void> {
    const row = {
      id: record.id,
      identifier: record.identifier,
      timestamp: record.timestamp,
      method: record.method
    };
    await supabase.from('login_history').insert(row);
  },

  async getLoginHistory(): Promise<LoginRecord[]> {
    const { data } = await supabase.from('login_history').select('*');
    if (!data) return [];
    return data.map(r => ({
        id: r.id,
        identifier: r.identifier,
        timestamp: r.timestamp,
        method: r.method as 'email' | 'phone'
    }));
  }
};