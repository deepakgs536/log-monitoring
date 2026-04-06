import mongoose, { Schema, Document } from 'mongoose';
import { Application } from './types';

// Extend the Application type for mongoose document
export interface IApplication extends Omit<Application, 'id'>, Document {
    id: string; // override _id mapping or keep separate? We can store the UUID in 'id' properly.
}

const ApplicationSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    apiKey: { type: String, required: false },
    ownerId: { type: String, required: false },
    guestIds: { type: [String], default: [] },
    createdAt: { type: Number, required: true, default: Date.now }
}, { 
    timestamps: false,
    versionKey: false
});

// Since Next.js API routes are ephemeral, we must check if the model is already compiled
export const AppModel = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
