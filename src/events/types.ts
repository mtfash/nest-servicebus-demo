export enum EventType {
  PostLike,
  PostComment,
}

export type PostLikeEvent = {
  eventType: EventType.PostLike;
  eventId: string;
  payload: {
    post: string;
    postOwner: string;
    likedBy: string;
    timestamp: Date;
  };
};

export type PostCommentEvent = {
  eventType: EventType.PostComment;
  eventId: string;
  payload: {
    post: string;
    postOwner: string;
    commentAuthor: string;
    comment: string;
    timestamp: Date;
  };
};

// To narrow down AppEvent type to PostLikeEvent or PostCommentEvent, later we can use the eventType common property
export type AppEvent = PostLikeEvent | PostCommentEvent;
