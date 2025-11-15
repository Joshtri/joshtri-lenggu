import { BaseEntity } from "@/interfaces/api";

export interface CommentAuthor {
    id: string;
    name: string;
    image: string | null;
    role: "ADMIN" | "VISITOR";
}

export interface Comment extends BaseEntity {
    content: string;
    authorId: string | null;
    postId: string | null;
    parentId: string | null; // For nested/threaded comments
    author?: CommentAuthor | null; // Author information
}

export interface CreateCommentInput {
    content: string;
    authorId: string; // Required - user must be authenticated to comment
    postId: string;
    parentId?: string;
}

export interface UpdateCommentInput {
    content?: string;
}
