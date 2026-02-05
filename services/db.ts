
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
  async checkSystemHealth() {
    const results = {
      profilesTable: false,
      resourcesTable: false,
      submissionsTable: false,
      ordersTable: false,
      resourcesBucket: false,
      submissionsBucket: false
    };

    try {
      // Test Table Existence via Select
      const { error: p } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
      results.profilesTable = !p || (p.code !== '42P01');
      
      const { error: r } = await supabase.from('resources').select('id', { count: 'exact', head: true }).limit(1);
      results.resourcesTable = !r || (r.code !== '42P01');

      const { error: s } = await supabase.from('submissions').select('id', { count: 'exact', head: true }).limit(1);
      results.submissionsTable = !s || (s.code !== '42P01');

      const { error: o } = await supabase.from('orders').select('id', { count: 'exact', head: true }).limit(1);
      results.ordersTable = !o || (o.code !== '42P01');

      // Test Bucket Existence
      const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
      if (!bErr && buckets) {
          results.resourcesBucket = buckets.some(b => b.name === 'resources');
          results.submissionsBucket = buckets.some(b => b.name === 'submissions');
      } else {
          console.warn("Could not list buckets", bErr);
      }
    } catch (e) {
      console.error("Health check failed critical path", e);
    }

    return results;
  },

  async getAllResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      return MOCK_RESOURCES;
    }
    
    if (!data || data.length === 0) return MOCK_RESOURCES;

    return data.map(mapResource);
  },

  async addResource(resource: Resource): Promise<void> {
    const row = mapResourceToRow(resource);
    const { error } = await supabase.from('resources').insert(row);
    if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
            throw new Error("PERMISSION_DENIED_RESOURCES");
        }
        throw new Error(`DB_ERROR: ${error.message}`);
    }
  },

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) console.error('Error deleting resource:', error);
    await supabase.storage.from('resources').remove([`${id}.pdf`]);
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
    
    if (error) return [];

    let current: string[] = data?.saved_resources || [];
    if (current.includes(resourceId)) {
        current = current.filter(id => id !== resourceId);
    } else {
        current.push(resourceId);
    }

    await supabase.from('profiles').update({ saved_resources: current }).eq('id', userId);
    return current;
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
        console.error('Storage Upload Error Detail:', uploadError);
        const errObj = uploadError as any;
        
        // Handle 403 RLS violation
        if (errObj.statusCode === "403" || errObj.message?.includes('policy') || errObj.error === "Unauthorized" || errObj.status === 403) {
            throw new Error("PERMISSION_DENIED_SUBMISSIONS");
        }
        
        if (errObj.message?.includes('Bucket not found') || errObj.statusCode === "404" || errObj.status === 404) {
            throw new Error("BUCKET_MISSING_SUBMISSIONS");
        }
        throw new Error(`UPLOAD_FAILED: ${uploadError.message}`);
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
    if (error) {
        if (error.code === '42501' || error.message?.includes('row-level security')) {
            throw new Error("PERMISSION_DENIED_TABLE_SUBMISSIONS");
        }
        throw new Error(`TABLE_MISSING_SUBMISSIONS: ${error.message}`);
    }
  },

  async createOrder(order: any): Promise<void> {
    const { error } = await supabase.from('orders').insert({
        id: crypto.randomUUID(),
        user_id: order.userId,
        email: order.email,
        item_name: order.itemName,
        subject: order.subject,
        semester: order.semester,
        details: order.details,
        status: 'pending',
        timestamp: Date.now()
    });
    if (error) {
        throw new Error(`TABLE_MISSING_ORDERS: ${error.message}`);
    }
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
    const { data: sub } = await supabase.from('submissions').select('file_path').eq('id', id).single();
    if (sub?.file_path) {
        await supabase.storage.from('submissions').remove([sub.file_path]);
    }
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (error) console.error('Error deleting submission:', error);
  },

  async saveFile(resourceId: string, file: Blob): Promise<string | null> {
    const fileName = `${resourceId}.pdf`; 
    const { error } = await supabase.storage
        .from('resources')
        .upload(fileName, file, { upsert: true });

    if (error) {
        const errObj = error as any;
        if (errObj.statusCode === "403" || errObj.message?.includes('policy') || errObj.status === 403) {
            throw new Error("PERMISSION_DENIED_RESOURCES");
        }
        if (errObj.message?.includes('Bucket not found') || errObj.statusCode === "404" || errObj.status === 404) {
            throw new Error("BUCKET_MISSING_RESOURCES");
        }
        return null;
    }

    const { data } = supabase.storage.from('resources').getPublicUrl(fileName);
    return data.publicUrl;
  },

  async getFileUrl(id: string): Promise<string | undefined> {
     if (id.startsWith('res-')) {
         const cleanId = id.replace('res-', '');
         const { data } = supabase.storage.from('resources').getPublicUrl(`${cleanId}.pdf`);
         return data.publicUrl;
     } else if (id.startsWith('sub-')) {
         const subId = id.replace('sub-', '');
         const { data: subData } = await supabase.from('submissions').select('file_path').eq('id', subId).single();
         if (subData?.file_path) {
             const { data, error } = await supabase.storage.from('submissions').createSignedUrl(subData.file_path, 3600);
             if (error) return undefined;
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
