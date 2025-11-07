import { BaseEntity } from "@/interfaces/api";

export interface Post  extends BaseEntity{
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    authorId: number | null;
    labelId: number | null;
    typeId: number | null;
}

export interface CreatePostInput {
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    authorId?: number;
    labelId?: number;
    typeId?: number;
}

export interface UpdatePostInput {
    slug?: string;
    title?: string;
    coverImage?: string;
    content?: string;
    excerpt?: string;
    authorId?: number;
    labelId?: number;
    typeId?: number;
}