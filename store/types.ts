import { AuthState } from '@/lib/types/auth.types';
import { ImageState } from '@/lib/types/image.types';

export interface RootState {
  auth: AuthState;
  image: ImageState;
  authApi: any;
  imageApi: any;
}