import { Document } from 'mongoose';

export default function updateDocument(document: Document, updates: any) {
  Object.keys(updates).forEach((k: string) => {
    document.set(k, updates[k]);
  });

  return document;
}
