import type { AuthState, ImageState } from '@/types';

export interface RootState {
  auth: AuthState;
  image: ImageState;
  authApi: any;
  imageApi: any;
}