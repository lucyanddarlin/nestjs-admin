import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { RouterModule } from '@nestjs/core'
import { RoleModule } from './role/role.module'
import { MenuModule } from './menu/menu.module'

const modules = [
  UserModule,
  RoleModule,
  MenuModule,
]

@Module({
  imports: [
    ...modules,
    RouterModule.register([
      {
        path: 'system',
        module: SystemModule,
        children: [...modules],
      },
    ]),
  ],
  exports: [...modules],
})
export class SystemModule {}
