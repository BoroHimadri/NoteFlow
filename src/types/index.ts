export interface loginCred {
  email: string;
  password: string;
}

export type NoteTag = "work" | "personal" | "ideas" | "research" | "journal";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  pinned?: boolean;
  updatedAt: string;
}
