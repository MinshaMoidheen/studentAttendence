export interface Teacher {
  id: string;
  name: string;
  division: string;
  class: string;
  password: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeacherRequest {
  name: string;
  division: string;
  class: string;
  password: string;
  phone?: string;
}

export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {
  id: string;
}

export interface TeacherFormData {
  name: string;
  division: string;
  class: string;
  password: string;
  confirmPassword: string;
  phone: string;
}
