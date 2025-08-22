'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type DocRow = {
  id: string;
  file_name: string;
  storage_path: string;
  status: 'draft'|'sent'|'completed'|'declined'|'voided';
  created_at: string;
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Please log in'); setLoading(false); return; }
    const { data, error } = await supabase
      .from('documents')
      .select('id,file_name,storage_path,status,created_at')
      .order('created_at', { ascending: false });
    if (error) alert(error.message);
    else setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Please log in'); return; }

    const path = `users/${user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { upsert: false });
    if (upErr) { alert(upErr.message); return; }

    const { error: insErr } = await supabase.from('documents').insert({
      owner_id: user.id,
      file_name: file.name,
      storage_path: path
    });
    if (insErr) { alert(insErr.message); return; }

    await load();
    e.currentTarget.value = '';
  };

  const download = async (row: DocRow) => {
    const { data, error } = await supabase
      .storage.from('documents')
      .createSignedUrl(row.storage_path, 60);
    if (error || !data?.signedUrl) { alert(error?.message || 'No URL'); return; }
    window.open(data.signedUrl, '_blank');
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Documents</h1>
      <input type="file" accept="application/pdf" onChange={onUpload} />
      {loading ? <p>Loading…</p> : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {docs.map(d => (
            <li key={d.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ flex: 1 }}>
                <strong>{d.file_name}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>{new Date(d.created_at).toLocaleString()}</div>
              </span>
              <span style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 8 }}>{d.status}</span>
              <button onClick={() => download(d)}>Download</button>
            </li>
          ))}
          {!docs.length && <p>No documents yet. Upload a PDF above.</p>}
        </ul>
      )}
    </div>
  );
}
