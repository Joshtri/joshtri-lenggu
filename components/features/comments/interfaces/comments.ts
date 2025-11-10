import { BaseEntity } from "@/interfaces/api";

export interface Comment extends BaseEntity {
    content: string;
    authorId: string | null;
    postId: string | null;
    parentId: string | null; // For nested/threaded comments
}

export interface CreateCommentInput {
    content: string;
    authorId?: string;
    postId: string;
    parentId?: string;
}

export interface UpdateCommentInput {
    content?: string;
}
