'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type TxType = 'LISTING' | 'INVESTMENT' | 'RENTA L'; // typo guard: remove space in RENTAL if you copy

export default function NewTransactionForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TxType>('LISTING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, type }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Failed to create');
      }

      setTitle('');
      setType('LISTING');
      onCreated();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="123 Main St Listing"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TxType)}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="LISTING">Listing</option>
          <option value="INVESTMENT">Investment</option>
          <option value="RENTAL">Rental</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? 'Creating…' : 'Create Transaction'}
      </button>
    </form>
  );
}
