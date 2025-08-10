import { z } from 'zod';

export const uploadVideoSchema = z.object({
    description: z.string().min(1, {
        message: 'Description must be at least 1 characters.',
    }),
    status: z.enum(['public', 'friends', 'onlyMe']),
});

export type UploadVideoSchemaType = z.TypeOf<typeof uploadVideoSchema>;
