export interface loginCred {
  email: string;
  password: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  is_pinned?: boolean;
  created_at: string;
}
