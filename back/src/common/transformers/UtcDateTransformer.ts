import { ValueTransformer } from 'typeorm';

export const UtcDateTransformer: ValueTransformer = {
    to: (value: Date | null) => value,
    from: (value: Date | null) => {
        if (!value) return value;
        return new Date(value.toISOString());
    },
};