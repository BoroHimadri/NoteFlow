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
  updatedAt: string; // formatted display string e.g. "Today, 10:42 am"
}
