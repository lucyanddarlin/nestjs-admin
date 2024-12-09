import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { RouterModule } from '@nestjs/core'
import { RoleModule } from './role/role.module'
import { MenuModule } from './menu/menu.module';

const modules = [
  UserModule,
  RoleModule,
]

@Module({
  imports: [...modules, RouterModule.register([
    {
      path: 'system',
      module: SystemModule,
      children: [...modules],
    },
  ]), MenuModule],
  exports: [...modules],
})
export class SystemModule {}
