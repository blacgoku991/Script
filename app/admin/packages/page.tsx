'use client';

import { useState } from 'react';
import { PACKAGES, formatCurrency } from '@/lib/utils';
import { Package } from '@/types';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>(PACKAGES);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Package>>({});

  function startEdit(pkg: Package) {
    setEditing(pkg.id);
    setEditData(pkg);
  }

  function saveEdit() {
    setPackages(prev =>
      prev.map(p => (p.id === editing ? { ...p, ...editData } : p))
    );
    setEditing(null);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Gestion des forfaits</h1>
        <p className="text-gray-500 mt-1">Modifiez les prix, durées et descriptions des forfaits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className={`glass rounded-2xl overflow-hidden border ${pkg.featured ? 'border-amber-500/40' : 'border-amber-500/10'}`}>
            {pkg.featured && (
              <div className="px-6 py-2 text-xs font-bold text-center"
                style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.2), rgba(201,168,76,0.1))', color: '#C9A84C' }}>
                FORFAIT LE PLUS POPULAIRE
              </div>
            )}

            <div className="p-6">
              {editing === pkg.id ? (
                // Edit mode
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nom"
                      value={editData.name || ''}
                      onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                    />
                    <Input
                      label="Prix (MAD)"
                      type="number"
                      value={editData.price || 0}
                      onChange={e => setEditData(d => ({ ...d, price: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Durée (secondes)"
                      type="number"
                      value={editData.duration || 0}
                      onChange={e => setEditData(d => ({ ...d, duration: Number(e.target.value) }))}
                    />
                    <Input
                      label="Fréquence"
                      value={editData.frequency || ''}
                      onChange={e => setEditData(d => ({ ...d, frequency: e.target.value }))}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    value={editData.description || ''}
                    onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                    rows={2}
                  />
                  <Input
                    label="Idéal pour"
                    value={editData.bestFor || ''}
                    onChange={e => setEditData(d => ({ ...d, bestFor: e.target.value }))}
                  />
                  <div className="flex gap-3 mt-2">
                    <Button variant="gold" onClick={saveEdit}>Enregistrer</Button>
                    <Button variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-amber-500 font-black text-3xl">{pkg.duration}s</span>
                      <h3 className="text-white font-bold text-lg">{pkg.name}</h3>
                      <p className="text-gray-500 text-xs">{pkg.bestFor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-2xl">{formatCurrency(pkg.price)}</p>
                      <p className="text-gray-600 text-xs mt-1">{pkg.frequency}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  <ul className="flex flex-col gap-1.5 mb-5">
                    {pkg.features.map(f => (
                      <li key={f} className="text-xs text-gray-500 flex gap-2">
                        <span className="text-amber-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" onClick={() => startEdit(pkg)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
