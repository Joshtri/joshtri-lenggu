import { relations } from "drizzle-orm";
import { posts } from "./posts.schema";
import { labels } from "./labels.schema";
import { users } from "./users.schema";
import { comments } from "./comments.schema";

// Define relations for posts
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  label: one(labels, {
    fields: [posts.labelId],
    references: [labels.id],
  }),
  comments: many(comments),
}));

// Define relations for labels
export const labelsRelations = relations(labels, ({ many }) => ({
  posts: many(posts),
}));

// Define relations for users
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

// Define relations for comments
export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));