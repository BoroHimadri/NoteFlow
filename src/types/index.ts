export interface loginCred {
  email: string;
  password: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned?: boolean;
  created_at: string;
}
