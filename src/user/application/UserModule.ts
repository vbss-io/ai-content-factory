import { ZodAdapter } from '@/@api/infra/validate/ZodAdapter'
import { UserRepositoryMongo } from '@/user/infra/repositories/UserRepositoryMongo'
import { UploadAvatarSchema } from '@/user/infra/schemas/UploadAvatarSchema'
import { Registry } from '@api/infra/dependency-injection/Registry'
import { UserController } from './controllers/UserController'
import { RemoveAvatar } from './usecases/RemoveAvatar'
import { UploadAvatar } from './usecases/UploadAvatar'

export class UserModule {
  constructor () {
    const uploadAvatarValidate = new ZodAdapter(UploadAvatarSchema)
    Registry.getInstance().provide('uploadAvatarValidate', uploadAvatarValidate)
    const userRepository = new UserRepositoryMongo()
    Registry.getInstance().provide('userRepository', userRepository)
    const uploadAvatar = new UploadAvatar()
    const removeAvatar = new RemoveAvatar()
    Registry.getInstance().provide('uploadAvatar', uploadAvatar)
    Registry.getInstance().provide('removeAvatar', removeAvatar)
    new UserController()
  }
}
